// System Module Imports
import { ACTION_TYPE, ITEM_TYPE } from './constants.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     * @remarks https://github.com/Larkinabout/fvtt-token-action-hud-core/wiki/Core-Changes-for-System-Module-Developers
     */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        /**
         * Build system actions
         * Called by Token Action HUD Core
         * @override
         */
        async buildSystemActions () {
            this.actorType = this.actor?.type
            this.tooltipDirection = this.#getTooltipDirection()

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
                this.effects = this.actor.effects
            }

            if (this.actorType === 'character') {
                this.#buildCharacterActions()
            } else if (this.actorType === 'npc') {
                this.#buildNPCActions()
            } else if (!this.actor) {
                this.#buildMultipleTokenActions()
            }
        }

        /**
         * Build character actions
         * @private
         */
        #buildCharacterActions () {
            this.#buildCheckActions()
            this.#buildCombatActions()
            this.#buildItems()
            // this.#buildTravel()
            this.#buildEffects()
            this.#buildDowntimeActions()
        }

        /**
         * Build npc actions
         * @private
         */
        #buildNPCActions () {
            this.#buildCheckActions()
            this.#buildCombatActions()
            this.#buildItems()
            this.#buildEffects()
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
        }

        /**
         * Build Check Action actions for the HUD
         *
         * This method will create buttons for each checks action type.
         * @private
         */
        async #buildCheckActions () {
            const checkActions = [
                { id: 'attributeCheck', name: 'Attribute Check' },
                { id: 'openCheck', name: 'Open Check' },
                { id: 'groupCheck', name: 'Group Check' },
                { id: 'initiativeCheck', name: 'Initiative Check' }
            ]

            const actionTypeId = 'action'
            const checkGroupId = 'check'

            const actions = checkActions.map(action => {
                return {
                    id: action.id,
                    name: coreModule.api.Utils.i18n(action.name),
                    listName: action.name,
                    encodedValue: [actionTypeId, action.id].join(this.delimiter) // Ensure delimiter is defined
                }
            })

            const checkGroupData = { id: checkGroupId, type: 'system' }
            this.addActions(actions, checkGroupData)
        }

        /**
         * Build Combat Action actions for the HUD
         *
         * This method will create buttons for each combat action type.
         * @private
         */
        async #buildCombatActions () {
            const combatActions = [
                { id: 'guardAction', name: 'Guard', rule: 'FU.GuardRule' },
                { id: 'equipmentAction', name: 'Equipment', rule: 'FU.EquipmentRule' },
                { id: 'hinderAction', name: 'Hinder', rule: 'FU.HinderRule' },
                { id: 'inventoryAction', name: 'Inventory', rule: 'FU.InventoryRule' },
                { id: 'objectiveAction', name: 'Objective', rule: 'FU.ObjectiveRule' },
                { id: 'spellAction', name: 'Spell', rule: 'FU.SpellRule' },
                { id: 'studyAction', name: 'Study', rule: 'FU.StudyRule' },
                { id: 'skillAction', name: 'Skill', rule: 'FU.SkillRule' }
            ]

            const actionTypeId = 'action'
            const combatGroupId = 'action' // Group ID for combat actions

            const actions = combatActions.map(action => {
                const actionObj = {
                    id: action.id,
                    name: coreModule.api.Utils.i18n(action.name),
                    listName: action.name,
                    encodedValue: [actionTypeId, action.id].join(this.delimiter) // Ensure delimiter is defined
                }

                // Add tooltip if action has rule text
                if (action.rule) {
                    const ruleText = coreModule.api.Utils.i18n(action.rule)
                    if (ruleText && ruleText !== action.rule) { // Only if localization exists
                        actionObj.tooltip = {
                            content: `<h4>${actionObj.name}</h4><p>${ruleText}</p>`,
                            class: 'tah-system-tooltip',
                            direction: this.tooltipDirection
                        }
                    }
                }

                return actionObj
            })

            const combatGroupData = { id: combatGroupId, type: 'system' }
            this.addActions(actions, combatGroupData)
        }

        /**
         * Get tooltip direction based on TAH Core direction setting
         * @private
         * @returns {string} The tooltip direction (UP, DOWN, LEFT, RIGHT, CENTER)
         */
        #getTooltipDirection () {
            const direction = game.settings.get('token-action-hud-core', 'direction') || 'auto'

            switch (direction) {
            case 'up':
                return 'DOWN'
            case 'down':
                return 'UP'
            case 'auto':
            default:
                return 'DOWN'
            }
        }

        /**
         * Enrich item tooltip content with additional formatting and item properties
         * @private
         * @param {string} name The item name
         * @param {string} description The item description
         * @param {object} itemData The full item data object
         * @returns {string} Enhanced HTML content
         */
        #enrichItemTooltip (name, description, itemData) {
            const itemType = itemData.type.charAt(0).toUpperCase() + itemData.type.slice(1)
            const stats = this.#getItemStats(itemData)

            const hints = [
                "Left-click to use",
                "Right-click for sheet"
            ]

            if (itemData.type === "customWeapon" && itemData.system.isTransforming)
                hints.push("Ctrl+click to change forms")

            return `
                <div class='tah-tooltip-header'>
                    <h4>${name}</h4>
                    <span class='tah-item-badge'>${itemType}</span>
                </div>
                <div class='tah-tooltip-body'>
                    ${stats}
                    ${description ? `<p>${description}</p>` : ''}
                    <div class='tah-tooltip-hint'><em>${hints.join(" ◆ ")}</em></div>
                </div>
            `
        }

        /**
         * Get formatted stats for different item types
         * @private
         * @param {object} itemData The item data object
         * @returns {string} Formatted stats HTML
         */
        #getItemStats (itemData) {
            const stats = []
            const { system, type } = itemData

            if (!system) return ''

            // Handle spell
            if (type === 'spell' && system.rollInfo) {
                const accuracy = system.rollInfo.accuracy?.value
                if (accuracy !== undefined) {
                    const primary = system.rollInfo.attributes?.primary?.value || 'DEX'
                    const secondary = system.rollInfo.attributes?.secondary?.value || 'INS'
                    stats.push(`<strong>Accuracy:</strong> 【${primary.toUpperCase()} + ${secondary.toUpperCase()}】+${accuracy}`)
                }

                if (system.rollInfo.damage?.hasDamage?.value) {
                    const damage = system.rollInfo.damage.value || 0
                    const damageType = system.rollInfo.damage.type.value || 'Physical'
                    stats.push(`<strong>Damage:</strong> 【HR + ${damage}】 ${damageType}`)
                }
            }

            // Handle weapon/basic
            if ((type === 'weapon' || type === 'basic') && system.damage) {
                const accuracy = system.accuracy?.value;

                if (accuracy !== undefined) {
                    const primary = system.attributes?.primary?.value || 'MIG'
                    const secondary = system.attributes?.secondary?.value || 'MIG'
                    stats.push(`<strong>Accuracy:</strong> 【${primary.toUpperCase()} + ${secondary.toUpperCase()}】+${accuracy}`)
                }

                const damage = system.damage.value || 0
                const damageType = system.type?.value || 'Physical'
                stats.push(`<strong>Damage:</strong> 【HR + ${damage}】 ${damageType}`)
            }

            // Handle custom weapons
            if ((type === 'customWeapon') && system.damage) {
                const activeForm = system[system.activeForm];
                const accuracy = activeForm.accuracy;                

                if (activeForm.accuracy !== undefined) {
                    const primary = activeForm.attributes.primary || 'MIG';
                    const secondary = activeForm.attributes.secondary || 'MIG';
                    stats.push(`<strong>Accuracy:</strong> 【${primary.toUpperCase()} + ${secondary.toUpperCase()}】+${accuracy}`);
                }

                const damage = activeForm.damage.value || 0;
                const damageType = activeForm.damage.type || 'Physical';
                stats.push(`<strong>Damage:</strong> 【HR + ${damage}】 ${damageType}`);
            }

            return stats.length > 0 ? stats.map(stat => `<div class='tah-item-stats'>${stat}</div>`).join('') : ''
        }

        /**
         * @description Active Effects on the actor
         * @returns {Promise<void>}
         */
        async #buildEffects () {
            const typeId = 'effect'
            const tempGroupId = 'temporaryEffect'
            const passiveGroupId = 'passiveEffect'
            const inactiveGroupId = 'inactiveEffect'

            const getAction = (effect) => {
                const action = {
                    id: effect.id,
                    name: coreModule.api.Utils.i18n(effect.name),
                    listName: effect.name,
                    img: coreModule.api.Utils.getImage(effect),
                    encodedValue: [typeId, effect.id].join(this.delimiter) // Ensure delimiter is defined
                }

                // Add tooltip if effect has description
                if (effect.description) {
                    action.tooltip = {
                        content: `<h4>${effect.name}</h4><p>${effect.description}</p>`,
                        class: 'tah-system-tooltip',
                        direction: this.#getTooltipDirection()
                    }
                }

                return action
            }

            /**
             * @param {Object[]} actions
             * @param {String} groupId
             */
            const addEffectGroup = (actions, groupId) => {
                const groupData = { id: groupId, type: 'system' }
                this.addActions(actions, groupData)
            }

            // Prepare active effects
            const effects = this.actor.effectCategories
            const temporaryEffects = effects.temporary.effects.map(getAction)
            const passiveEffects = effects.passive.effects.map(getAction)
            const inactiveEffects = effects.inactive.effects.map(getAction)

            addEffectGroup(temporaryEffects, tempGroupId)
            addEffectGroup(passiveEffects, passiveGroupId)
            addEffectGroup(inactiveEffects, inactiveGroupId)
        }

        /**
         * @description Active Effects on the actor
         * @returns {Promise<void>}
         */
        async #buildDowntimeActions () {
            const actionTypeId = 'utility'
            const groupId = 'downtime'

            const restAction = {
                id: 'rest',
                name: coreModule.api.Utils.i18n('Rest'),
                listName: 'Rest',
                encodedValue: [actionTypeId, 'rest'].join(this.delimiter)
            }

            // Add the travel action to the "Travel" group
            const groupData = { id: groupId, type: 'system' }
            this.addActions([restAction], groupData)
        }

        /**
         * Build Inventory Actions for the HUD, including equipped items.
         * @private
         *
         * This method handle the construction of action buttons for items in the actor's
         * inventory, organized by equipment slots.
         */
        async #buildItems () {
            // Exit if the actor has no items
            if (this.items.size === 0) return

            const actionTypeId = 'item' // Action type identifier
            const inventoryMap = new Map() // Map for categorized inventory items

            // Equipment slots
            const slots = ['mainHand', 'offHand', 'phantom', 'armor', 'accessory', 'arcanum']
            const equippedItemIds = new Set() // Store equipped item IDs

            for (const slot of slots) {
                const equippedItemId = this.actor.system.equipped[slot]
                if (equippedItemId) equippedItemIds.add(equippedItemId)
            }

            // Categorize items in the inventory
            for (const [itemId, itemData] of this.items) {
                if (itemData.type === 'weapon' && this.actorType === 'npc') {
                    continue
                }
                const typeMap = inventoryMap.get(itemData.type) ?? new Map()
                typeMap.set(itemId, itemData)
                inventoryMap.set(itemData.type, typeMap)
            }

            // Create action buttons for each item type
            for (const [type, typeMap] of inventoryMap) {
                const groupId = ITEM_TYPE[type]?.groupId
                if (!groupId) continue // Skip if no group ID

                const groupData = { id: groupId, type: 'system' } // Group data for the item type


                // Generate actions for items in this type
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    let name = itemData.name
                    const description = itemData.system.description || ''
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}<br>${description}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)
                    const img = coreModule.api.Utils.getImage(itemData)

                    if (itemData.type === 'customWeapon' && itemData.system.isTransforming) {
                        const activeForm = itemData.system[itemData.system.activeForm];
                        if (activeForm.name)
                            name = `${itemData.name} - ${activeForm.name}`

                    }

                    // Add tooltip if item has description
                    const action = {
                        id,
                        name,
                        listName,
                        img,
                        encodedValue
                    }

                    // Always show tooltip for items (even without description)
                    action.tooltip = {
                        content: this.#enrichItemTooltip(name, description, itemData),
                        class: 'tah-system-tooltip',
                        direction: this.tooltipDirection
                    }

                    return action
                })

                this.addActions(actions, groupData) // Add actions to the group
            }

            // Handle equipped items separately for the "Equipped" group
            const equippedActions = [...this.items].filter(([itemId]) => equippedItemIds.has(itemId)).map(([itemId, itemData]) => {
                const id = itemId
                const name = itemData.name
                const description = itemData.system.description || ''
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}<br>${description}`
                const encodedValue = [actionTypeId, id].join(this.delimiter)
                const img = coreModule.api.Utils.getImage(itemData)

                const action = {
                    id,
                    name,
                    listName,
                    img,
                    encodedValue
                }

                // Always show tooltip for items (even without description)
                action.tooltip = {
                    content: this.#enrichItemTooltip(name, description, itemData),
                    class: 'tah-system-tooltip',
                    direction: this.tooltipDirection
                }

                return action
            })

            // Add equipped actions to the "Equipped" group
            const equippedGroupData = { id: 'equipped', type: 'system' }
            this.addActions(equippedActions, equippedGroupData)
        }
    }
})
