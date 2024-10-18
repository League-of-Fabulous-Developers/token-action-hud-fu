// System Module Imports
import { ACTION_TYPE, ITEM_TYPE } from './constants.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        /**
         * Build system actions
         * Called by Token Action HUD Core
         * @override
         * @param {array} groupIds
         */
        async buildSystemActions (groupIds) {
            // Set actor and token variables
            this.actors = (!this.actor) ? this._getActors() : [this.actor]
            this.actorType = this.actor?.type

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
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
            this.#buildCombatActions()
            this.#buildItems()
            this.#buildTravel()
            this.#buildResource('resource', 'feature')
        }

        /**
         * Build npc actions
         * @private
         */
        #buildNPCActions () {
            this.#buildCombatActions()
            this.#buildItems()
            this.#buildTravel()
            this.#buildResource('resource', 'feature')
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
        }

        /**
         * Build resource actions (with increase/decrease buttons for items with system.rp.current)
         * @private
         * @param {string} actionType   The type of action (e.g., 'resource')
         * @param {string} group        The group ID for categorizing the resources
         */
        async #buildResource (actionType, group) {
            if (this.items.size === 0) return

            const actionTypeId = actionType
            const inventoryMap = new Map()
            const manage = ['decrease', 'increase']
            const typeId = 'resource'

            // Map relevant item types to feature group IDs
            const featureGroups = {
                miscAbility: 'feature_miscAbility',
                ritual: 'feature_ritual',
                optionalFeature: 'feature_optionalFeature'
            }

            // Group and categorize items in the inventory
            for (const [itemId, itemData] of this.items) {
                const type = itemData.type
                const typeMap = inventoryMap.get(type) ?? new Map()
                typeMap.set(itemId, itemData)
                inventoryMap.set(type, typeMap)
            }

            // Loop through categorized items and create resource actions
            for (const [type, typeMap] of inventoryMap) {
                // Check if the item type is one of the relevant types
                if (!Object.keys(featureGroups).includes(type)) continue

                // Get the corresponding group ID for this type
                const featureGroupId = featureGroups[type];

                [...typeMap].forEach(([itemId, itemData]) => {
                    const hasResource = itemData.system?.hasResource?.value

                    // Only add actions for items with resource points (rp)
                    if (hasResource) {
                        // Create group for the item
                        const groupName = itemData.name
                        const group = {
                            id: featureGroupId,
                            name: groupName,
                            type: 'system-derived',
                            settings: { showTitle: false }
                        }
                        this.addGroup(group, { id: 'resource', type: 'system' })

                        // Create actions for decrease, increase, and current resource display
                        const resourceId = itemId
                        const resourceName = itemData.name
                        const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                        const resourceListName = `${actionTypeName ? `${actionTypeName}: ` : ''}${resourceName}`
                        const resourceEncodedValue = [actionTypeId, resourceId].join(this.delimiter)
                        const resourceGroup = { id: featureGroupId, type: 'system-derived' }
                        const rpCurrent = `${itemData.system.rp.current}`
                        const info1 = { text: resourceName, title: 'baseitem' }

                        const actions = []

                        // Add decrease/increase buttons
                        manage.forEach(manageAction => {
                            const id = manageAction + '-' + resourceId
                            const name = manageAction === 'decrease' ? '-' : '+'
                            const listName = `${resourceName ? `${resourceName}: ` : ''}${manageAction}`
                            const encodedValue = [typeId, id].join(this.delimiter)
                            actions.push({ id, name, listName, encodedValue })
                        })

                        actions.push({
                            id: resourceId,
                            name: rpCurrent,
                            listName: resourceListName,
                            encodedValue: resourceEncodedValue,
                            info1,
                            cssClass: 'active'
                        })

                        // Add the actions to the group
                        this.addActions(actions, resourceGroup)
                    }
                })
            }
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
                { id: 'guardAction', name: 'Guard' },
                { id: 'equipmentAction', name: 'Equipment' },
                { id: 'hinderAction', name: 'Hinder' },
                { id: 'inventoryAction', name: 'Inventory' },
                { id: 'objectiveAction', name: 'Objective' },
                { id: 'spellAction', name: 'Spell' },
                { id: 'studyAction', name: 'Study' },
                { id: 'skillAction', name: 'Skill' }
            ]

            const actionTypeId = 'action'
            const combatGroupId = 'action' // Group ID for combat actions

            const actions = combatActions.map(action => {
                return {
                    id: action.id,
                    name: coreModule.api.Utils.i18n(action.name),
                    listName: action.name,
                    encodedValue: [actionTypeId, action.id].join(this.delimiter) // Ensure delimiter is defined
                }
            })

            const combatGroupData = { id: combatGroupId, type: 'system' }
            this.addActions(actions, combatGroupData)
        }

        /**
         * Build Travel Action actions for the HUD
         *
         * This method handle the construction of action buttons for all combat actions.
         *
         * @private
         */
        async #buildTravel () {
            const actionTypeId = 'action' // Action type identifier
            const travelGroupId = 'check' // Group ID for the travel actions

            // Define the travel action button
            const travelAction = {
                id: 'travelAction',
                name: coreModule.api.Utils.i18n('Travel Check'), // Label for the action button
                listName: 'Travel Check', // Tooltip or extended name
                encodedValue: [actionTypeId, 'travelCheck'].join(this.delimiter) // Encoded value for the action
            }

            // Add the travel action to the "Travel" group
            const travelGroupData = { id: travelGroupId, type: 'system' }
            this.addActions([travelAction], travelGroupData)
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

            // Gather equipped items from slots
            for (const slot of slots) {
                const equippedItemId = this.actor.system.equipped[slot]
                if (equippedItemId) equippedItemIds.add(equippedItemId)
            }

            // Categorize items in the inventory
            for (const [itemId, itemData] of this.items) {
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
                    const name = itemData.name
                    const description = itemData.system.description || ''
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}<br>${description}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
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

                return {
                    id,
                    name,
                    listName,
                    encodedValue
                }
            })

            // Add equipped actions to the "Equipped" group
            const equippedGroupData = { id: 'equipped', type: 'system' }
            this.addActions(equippedActions, equippedGroupData)
        }
    }
})
