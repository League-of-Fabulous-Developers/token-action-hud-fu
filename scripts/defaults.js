import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach((group) => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `${game.i18n.localize(
            'tokenActionHud.fu.group'
        )}: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'action',
                id: 'action',
                name: coreModule.api.Utils.i18n('Action'),
                groups: [
                    { ...groups.check, nestId: 'action_check' },
                    { ...groups.action, nestId: 'action_action' }
                ]
            },
            {
                nestId: 'feature',
                id: 'feature',
                name: coreModule.api.Utils.i18n('Feature'),
                groups: [
                    { ...groups.resource, nestId: 'feature_resource' },
                    { ...groups.basic, nestId: 'feature_basic' },
                    { ...groups.spell, nestId: 'feature_spell' },
                    { ...groups.miscAbility, nestId: 'feature_miscAbility' },
                    { ...groups.rule, nestId: 'feature_rule' },
                    { ...groups.ritual, nestId: 'feature_ritual' },
                    { ...groups.project, nestId: 'feature_project' },
                    { ...groups.classFeature, nestId: 'feature_classFeature' },
                    { ...groups.optionalFeature, nestId: 'feature_optionalFeature' }
                ]
            },
            {
                nestId: 'item',
                id: 'item',
                name: coreModule.api.Utils.i18n('Items'),
                groups: [
                    { ...groups.equipped, nestId: 'item_equipped' },
                    { ...groups.weapon, nestId: 'item_weapon' },
                    { ...groups.shield, nestId: 'item_shield' },
                    { ...groups.armor, nestId: 'item_armor' },
                    { ...groups.accessory, nestId: 'item_accessory' },
                    { ...groups.consumable, nestId: 'item_consumable' },
                    { ...groups.treasure, nestId: 'item_treasure' }
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                groups: [
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.token, nestId: 'utility_token' },
                    { ...groups.rests, nestId: 'utility_rests' },
                    { ...groups.utility, nestId: 'utility_utility' }
                ]
            }
        ],
        groups: groupsArray
    }
})
