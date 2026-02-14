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
    console.info('Initializing token action hud layout for FU')
    DEFAULTS = {
        layout: [
            {
                nestId: 'attack',
                id: 'attack',
                name: coreModule.api.Utils.i18n('Attack'),
                groups: [
                    { ...groups.basic, nestId: 'attack_basic' },
                    { ...groups.weapon, nestId: 'attack_weapon' },
                    { ...groups.customWeapon, nestId: 'attack_customWeapon' }
                ]
            },
            {
                nestId: 'feature',
                id: 'feature',
                name: coreModule.api.Utils.i18n('Skill'),
                groups: [
                    { ...groups.skill, nestId: 'feature_skill' },
                    { ...groups.miscAbility, nestId: 'feature_miscAbility' },
                    // { ...groups.rule, nestId: 'feature_rule' },
                    // { ...groups.ritual, nestId: 'feature_ritual' },
                    // { ...groups.project, nestId: 'feature_project' },
                    { ...groups.classFeature, nestId: 'feature_classFeature' },
                    { ...groups.optionalFeature, nestId: 'feature_optionalFeature' }
                ]
            },
            {
                nestId: 'spell',
                id: 'spell',
                name: coreModule.api.Utils.i18n('Spell'),
                groups: [
                    { ...groups.spell, nestId: 'spell_spell' },
                    // { ...groups.ritual, nestId: 'spell_ritual' }
                ]
            },
            {
                nestId: 'item',
                id: 'item',
                name: coreModule.api.Utils.i18n('Items'),
                groups: [
                    { ...groups.consumable, nestId: 'item_consumable' },
                    { ...groups.equipped, nestId: 'item_equipped' },
                    // { ...groups.shield, nestId: 'item_shield' },
                    // { ...groups.armor, nestId: 'item_armor' },
                    // { ...groups.accessory, nestId: 'item_accessory' },
                    // { ...groups.treasure, nestId: 'item_treasure' }
                ]
            },
            {
                nestId: 'action',
                id: 'action',
                name: coreModule.api.Utils.i18n('Action'),
                groups: [
                    { ...groups.action, nestId: 'action_action' },
                    // { ...groups.check, nestId: 'action_check' }
                ]
            },
            {
                nestId: 'effect',
                id: 'effect',
                name: coreModule.api.Utils.i18n('Effect'),
                groups: [
                    { ...groups.temporaryEffect, nestId: 'effect_temporary' },
                    { ...groups.passiveEffect, nestId: 'effect_passive' },
                    { ...groups.inactiveEffect, nestId: 'effect_inactive' }
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
                    { ...groups.utility, nestId: 'utility_utility' },
                    { ...groups.downtime, nestId: 'utility_downtime' }
                ]
            }
        ],
        groups: groupsArray
    }
})
