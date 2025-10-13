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
            const isShift = this.isShift;

            const renderable = ['item']

            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.renderItem(this.actor, actionId)
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
            case 'effect':
                this.#handleEffectAction(event, actor, actionId)
                break
            case 'utility':
                this.#handleUtilityAction(event, actor, token, actionId)
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
                await combatActionHandler.handleAction('equipment', isShift)
                break
            case 'guardAction':
                await combatActionHandler.handleAction('guard', isShift)
                break
            case 'hinderAction':
                await combatActionHandler.handleAction('hinder', isShift)
                break
            case 'inventoryAction':
                await combatActionHandler.handleAction('inventory', isShift)
                break
            case 'objectiveAction':
                await combatActionHandler.handleAction('objective', isShift)
                break
            case 'spellAction':
                await combatActionHandler.handleAction('spell', isShift)
                break
            case 'studyAction':
                await combatActionHandler.handleAction('study', isShift)
                break
            case 'skillAction':
                await combatActionHandler.handleAction('skill', isShift)
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
            default:
                console.warn(`Unknown action ID: ${actionId}`)
                break
            }
        }

        /**
         * @typedef KeyboardModifiers
         * @property {boolean} shift
         * @property {boolean} alt
         * @property {boolean} ctrl
         * @property {boolean} meta
         */

        /**
         * Handle item action
         * @private
         * @param {Event} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleItemAction (event, actor, actionId) {
            const item = actor.items.get(actionId)
            /** @type KeyboardModifiers **/
            const modifiers = {
                shift: event.shiftKey,
                ctrl: event.ctrlKey
            }
            
            if (item.type === "customWeapon" && item.system.isTransforming && modifiers.ctrl) {
                console.log("Changing form");
                item.system.switchForm();
            } else {
                item.roll(modifiers)
            }
        }

        /**
         * @param {Event} event
         * @param {Object} actor
         * @param {String} effectId
         */
        #handleEffectAction (event, actor, effectId) {
            const isRightClick = event.type === 'contextmenu'
            const effect = Array.from(actor.allEffects()).find((value) => value.id === effectId)
            console.debug(`Handling click event for effect ${effectId} = ${effect.name}; RightClick: ${isRightClick}`)
            const canBeManaged = !effect.statuses.has('crisis') && !effect.statuses.has('ko')
            if (isRightClick && canBeManaged) {
                // Don't allow deleting temporary effects from skills
                const isTemporary = effect.isTemporary && effect.parent.type !== 'skill'
                // Remove
                if (isTemporary) {
                    effect.delete()
                    this.#onUpdate()
                } else {
                    // Toggle the effect
                    effect.update({ disabled: !effect.disabled })
                    this.#onUpdate()
                }
            } else {
                // this.renderItem(actor, effectId)
            }
        }

        /**
         * Handle utility action
         * @private
         * @param {Event} event
         * @param {Object} actor
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #handleUtilityAction (event, actor, token, actionId) {
            switch (actionId) {
            case 'rest':
                // Really
                actor.rest()
                break
            }
        }

        /**
         * @description Forces an update of the HUD
         */
        #onUpdate () {
            Hooks.callAll('forceUpdateTokenActionHud')
        }
    }
})
