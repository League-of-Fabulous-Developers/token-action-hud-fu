import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'attack',
                id: 'attack',
                name: coreModule.api.Utils.i18n('Attack'),
                groups: [
                    { ...groups.mainSlot, nestId: 'attack_mainSlot' },
                    { ...groups.offSlot, nestId: 'attack_offSlot' },
                    { ...groups.armorSlot, nestId: 'attack_armorSlot' },
                    { ...groups.accessorySlot, nestId: 'attack_accessorySlot' }
                ]
            },
            {
                nestId: 'equipment',
                id: 'equipment',
                name: coreModule.api.Utils.i18n('Equipment'),
                groups: [
                    { ...groups.weapons, nestId: 'equipment_weapons' },
                    { ...groups.shields, nestId: 'equipment_shields' },
                    { ...groups.armor, nestId: 'equipment_armor' },
                    { ...groups.accessories, nestId: 'equipment_accessories' },
                    { ...groups.consumables, nestId: 'equipment_consumables' },
                    { ...groups.treasures, nestId: 'equipment_treasures' }
                ]
            },
            {
                nestId: 'guard',
                id: 'guard',
                name: coreModule.api.Utils.i18n('Guard'),
                groups: [
                    { ...groups.weapons, nestId: 'equipment_weapons' }
                ]
            },
            {
                nestId: 'spell',
                id: 'spell',
                name: coreModule.api.Utils.i18n('Spell'),
                groups: [
                    { ...groups.spells, nestId: 'spell_name' }
                ]
            },
            {
                nestId: 'travel',
                id: 'travel',
                name: coreModule.api.Utils.i18n('Travel'),
                groups: [
                    { ...groups.travels, nestId: 'travel_name' }
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
