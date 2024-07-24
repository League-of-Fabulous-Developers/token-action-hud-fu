// System Module Imports
import { ACTION_TYPE, ITEM_TYPE } from './constants.js'
import { Utils } from './utils.js'

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
         */a
        async buildSystemActions (groupIds) {
            // Set actor and token variables
            this.actors = (!this.actor) ? this._getActors() : [this.actor]
            this.actorType = this.actor?.type

            // Settings
            this.displayUnequipped = Utils.getSetting('displayUnequipped')

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
            this.#buildEquipment()
            this.#buildTravel()
        }

        /**
         * Build npc actions
         * @private
         */
        #buildNPCActions () {
        // this.#buildEquipment()
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
        }

        /**
         * Handle travel action click event
         * @private
         */
        handleTravelActionClick () {
            // Implement the logic to handle the click event for the travel action
            showTravelCheckDialog()
        }

        /**
         * Build inventory
         * @private
         */
        async #buildEquipment () {
            if (this.items.size === 0) return

            const actionTypeId = 'item'
            const inventoryMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type
                const equipped = itemData.equipped

                if (equipped || this.displayUnequipped) {
                    const typeMap = inventoryMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    inventoryMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of inventoryMap) {
                const groupId = ITEM_TYPE[type]?.groupId

                if (!groupId) continue

                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build travel roll action
         * @private
         */
        async #buildTravel () {
            const actionTypeId = 'travel' // Replace 'travel' with the correct action type ID
            // eslint-disable-next-line dot-notation
            const groupId = ITEM_TYPE['travel']?.groupId // Replace 'travel' with the correct type for the travel action

            if (!groupId) return

            const groupData = { id: groupId, type: 'system' }

            // Get actions
            const actions = [{
                id: 'travel',
                name: 'Travel',
                listName: 'Travel', // You can customize the display name
                encodedValue: [actionTypeId, 'travel'].join(this.delimiter) // You may need to adjust this based on your needs
            }]

            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)

            // Add click event listener to the travel action
            $(`#${groupData.id}`).click((ev) => {
                ev.preventDefault()
                this.handleTravelActionClick()
            })
        }
    }
})
