export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action click
         * Called by Token Action HUD Core when an action is left or right-clicked
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionClick (event, encodedValue) {
            const [actionTypeId, actionId] = encodedValue.split('|')

            const isShift = this.shift

            const renderable = ['item']

            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.doRenderItem(this.actor, actionId)
            }

            const knownCharacters = ['character']

            // If single actor is selected
            if (this.actor) {
                await this.#handleAction(event, this.actor, this.token, actionTypeId, actionId, isShift)
                return
            }

            const controlledTokens = canvas.tokens.controlled
                .filter((token) => knownCharacters.includes(token.actor?.type))

            // If multiple actors are selected
            for (const token of controlledTokens) {
                const actor = token.actor
                await this.#handleAction(event, actor, token, actionTypeId, actionId, isShift)
            }
        }

        /**
         * Handle action hover
         * Called by Token Action HUD Core when an action is hovered on or off
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionHover (event, encodedValue) {}

        /**
         * Handle group click
         * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
         * @override
         * @param {object} event The event
         * @param {object} group The group
         */
        async handleGroupClick (event, group) {}

        /**
         * Handle action
         * @private
         * @param {object} event        The event
         * @param {object} actor        The actor
         * @param {object} token        The token
         * @param {string} actionTypeId The action type id
         * @param {string} actionId     The actionId
         */
        async #handleAction (event, actor, token, actionTypeId, actionId, isShift) {
            switch (actionTypeId) {
            case 'item':
                this.#handleItemAction(event, actor, actionId)
                break
            case 'action':
                this.#handleCombatAction(event, actor, actionId, isShift)
                break
            case 'utility':
                this.#handleUtilityAction(token, actionId)
                break
            }
        }

        /**
         * Handles combat actions
         *
         * @private
         * @param {Event} event     The event
         * @param {Object} actor    The actor
         * @param {string} actionId The action type id
         * @param {boolean} isShift Whether Shift key was pressed
         *
         * @returns {Promise<void>}
         */
        async #handleCombatAction (event, actor, actionId, isShift) {
            const combatActionHandler = new game.projectfu.ActionHandler(actor)

            switch (actionId) {
            case 'equipmentAction':
                await combatActionHandler.handleAction('equipmentAction', isShift)
                break
            case 'guardAction':
                await combatActionHandler.handleAction('guardAction', isShift)
                break
            case 'hinderAction':
                await combatActionHandler.handleAction('hinderAction', isShift)
                break
            case 'inventoryAction':
                await combatActionHandler.handleAction('inventoryAction', isShift)
                break
            case 'objectiveAction':
                await combatActionHandler.handleAction('objectiveAction', isShift)
                break
            case 'spellAction':
                await combatActionHandler.handleAction('spellAction', isShift)
                break
            case 'studyAction':
                await combatActionHandler.handleAction('studyAction', isShift)
                break
            case 'skillAction':
                await combatActionHandler.handleAction('skillAction', isShift)
                break
            case 'attributeCheck':
                Hooks.call('promptAttributeCheckCalled', actor)
                break
            case 'openCheck':
                Hooks.call('promptOpenCheckCalled', actor)
                break
            case 'groupCheck':
                Hooks.call('promptGroupCheckCalled', actor)
                break
            case 'initiativeCheck':
                Hooks.call('promptInitiativeCheckCalled', actor)
                break
            case 'travelCheck':
                game.lookfar.showTravelCheckDialog()
                break
            default:
                console.warn(`Unknown action ID: ${actionId}`)
                break
            }
        }

        /**
         * Handle item action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleItemAction (event, actor, actionId) {
            const item = actor.items.get(actionId)
            item.roll()
        }

        /**
         * Handle utility action
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #handleUtilityAction (token, actionId) {
            switch (actionId) {
            case 'endTurn':
                if (game.combat?.current?.tokenId === token.id) {
                    await game.combat?.nextTurn()
                }
                break
            }
        }
    }
})
