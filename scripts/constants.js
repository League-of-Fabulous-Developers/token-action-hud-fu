/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-fu'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2.0'

/**
 * Action types
 */
export const ACTION_TYPE = {
    basic: 'TYPES.Item.basic',
    weapon: 'TYPES.Item.weapon',
    shield: 'TYPES.Item.shield',
    armor: 'TYPES.Item.armor',
    accessory: 'TYPES.Item.accessory',
    consumable: 'TYPES.Item.consumable',
    treasure: 'TYPES.Item.treasure',
    class: 'TYPES.Item.class',
    skill: 'TYPES.Item.skill',
    heroic: 'TYPES.Item.heroic',
    spell: 'TYPES.Item.spell',
    miscAbility: 'TYPES.Item.miscAbility',
    rule: 'TYPES.Item.rule',
    behavior: 'TYPES.Item.behavior',
    ritual: 'TYPES.Item.ritual',
    project: 'TYPES.Item.project',
    classFeature: 'TYPES.Item.classFeature',
    optionalFeature: 'TYPES.Item.optionalFeature',
    effect: 'TYPES.Item.effect',

    action: 'FU.Action',
    attack: 'FU.Attack',
    equipment: 'FU.Equipment',
    guard: 'FU.Guard',
    inventory: 'FU.Inventory',
    hinder: 'FU.Hinder',
    objective: 'FU.Objective',
    study: 'FU.Study',

    check: 'tokenActionHud.fu.check.label',
    travel: 'tokenActionHud.fu.check.travelcheck',
    utility: 'tokenActionHud.utility'
}

/**
 * Groups
 */
export const GROUP = {

    equipped: { id: 'equipped', name: 'tokenActionHud.fu.equipped.label', type: 'system' },
    basic: { id: 'basic', name: 'TYPES.Item.basic', type: 'system' },
    weapon: { id: 'weapon', name: 'TYPES.Item.weapon', type: 'system' },
    customWeapon: { id: 'customWeapon', name: 'TYPES.Item.weapon', type: 'system' },
    shield: { id: 'shield', name: 'TYPES.Item.shield', type: 'system' },
    armor: { id: 'armor', name: 'TYPES.Item.armor', type: 'system' },
    accessory: { id: 'accessory', name: 'TYPES.Item.accessory', type: 'system' },
    consumable: { id: 'consumable', name: 'TYPES.Item.consumable', type: 'system' },
    treasure: { id: 'treasure', name: 'TYPES.Item.treasure', type: 'system' },
    class: { id: 'class', name: 'TYPES.Item.class', type: 'system' },
    skill: { id: 'skill', name: 'TYPES.Item.skill', type: 'system' },
    heroic: { id: 'heroic', name: 'TYPES.Item.heroic', type: 'system' },
    miscAbility: { id: 'miscAbility', name: 'TYPES.Item.miscAbility', type: 'system' },
    rule: { id: 'rule', name: 'TYPES.Item.rule', type: 'system' },
    behavior: { id: 'behavior', name: 'TYPES.Item.behavior', type: 'system' },
    spell: { id: 'spell', name: 'TYPES.Item.spell', type: 'system' },
    ritual: { id: 'ritual', name: 'TYPES.Item.ritual', type: 'system' },
    project: { id: 'project', name: 'TYPES.Item.project', type: 'system' },
    classFeature: { id: 'classFeature', name: 'TYPES.Item.classFeature', type: 'system' },
    optionalFeature: { id: 'optionalFeature', name: 'TYPES.Item.optionalFeature', type: 'system' },
    effect: { id: 'effect', name: 'TYPES.Item.effect', type: 'system' },

    // Action Labels
    check: { id: 'check', name: 'tokenActionHud.fu.check.label', type: 'system' },
    action: { id: 'action', name: 'FU.Actions', type: 'system' },
    attack: { id: 'attack', name: 'FU.attack', type: 'system' },
    equipment: { id: 'equipment', name: 'FU.equipment', type: 'system' },
    guard: { id: 'guard', name: 'FU.guard', type: 'system' },
    inventory: { id: 'inventory', name: 'FU.inventory', type: 'system' },
    hinder: { id: 'hinder', name: 'FU.hinder', type: 'system' },
    objective: { id: 'objective', name: 'FU.objective', type: 'system' },
    study: { id: 'study', name: 'FU.study', type: 'system' },

    // Utility Labels
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },

    // Effects
    temporaryEffect: { id: 'temporaryEffect', name: 'FU.TemporaryEffects', type: 'system' },
    passiveEffect: { id: 'passiveEffect', name: 'FU.PassiveEffects', type: 'system' },
    inactiveEffect: { id: 'inactiveEffect', name: 'FU.InactiveEffects', type: 'system' },

    // Downtime
    downtime: { id: 'downtime', name: 'FU.Downtime', type: 'system' }
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    basic: { groupId: 'basic' },
    weapon: { groupId: 'weapon' },
    customWeapon: { groupId: 'customWeapon' },
    shield: { groupId: 'shield' },
    armor: { groupId: 'armor' },
    accessory: { groupId: 'accessory' },
    consumable: { groupId: 'consumable' },
    treasure: { groupId: 'treasure' },
    class: { groupId: 'class' },
    skill: { groupId: 'skill' },
    heroic: { groupId: 'heroic' },
    miscAbility: { groupId: 'miscAbility' },
    rule: { groupId: 'rule' },
    spell: { groupId: 'spell' },
    ritual: { groupId: 'ritual' },
    project: { groupId: 'project' },
    classFeature: { groupId: 'classFeature' },
    optionalFeature: { groupId: 'optionalFeature' },
    effect: { groupId: 'effect' }
}
