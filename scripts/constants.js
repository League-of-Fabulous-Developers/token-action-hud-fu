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
export const REQUIRED_CORE_MODULE_VERSION = '1.5'

/**
 * Action types
 */
export const ACTION_TYPE = {
    attack: 'tokenActionHud.attack',
    equipment: 'tokenActionHud.equipment',
    guard: 'tokenActionHud.guard',
    utility: 'tokenActionHud.utility'
}

/**
 * Groups
 */
export const GROUP = {
    mainSlot: { id: 'mainSlot', name: 'tokenActionHud.fu.attack.mainSlot', type: 'system' },
    offSlot: { id: 'offSlot', name: 'tokenActionHud.fu.attack.offSlot', type: 'system' },
    armorSlot: { id: 'armorSlot', name: 'tokenActionHud.fu.attack.armorSlot', type: 'system' },
    accessorySlot: { id: 'accessorySlot', name: 'tokenActionHud.fu.attack.accessorySlot', type: 'system' },

    weapons: { id: 'weapons', name: 'tokenActionHud.fu.equipment.weapons', type: 'system' },
    shields: { id: 'shields', name: 'tokenActionHud.fu.equipment.shields', type: 'system' },
    armor: { id: 'armor', name: 'tokenActionHud.fu.equipment.armor', type: 'system' },
    accessories: { id: 'accessories', name: 'tokenActionHud.fu.equipment.accessories', type: 'system' },
    consumables: { id: 'consumables', name: 'tokenActionHud.fu.equipment.consumables', type: 'system' },
    treasures: { id: 'treasures', name: 'tokenActionHud.fu.equipment.treasures', type: 'system' },

    // Action Labels
    spells: { id: 'spells', name: 'tokenActionHud.fu.spells.label', type: 'system' },
    miscAbility: { id: 'abilities', name: 'tokenActionHud.fu.abilities.label', type: 'system' },

    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    weapon: { groupId: 'weapons' },
    shield: { groupId: 'shields' },
    armor: { groupId: 'armor' },
    accessory: { groupId: 'accessories' },
    consumable: { groupId: 'consumables' },
    treasure: { groupId: 'treasures' },
    spell: { groupId: 'spells' },
    miscAbility: { groupId: 'abilities' }
}

/**
 * Item types
 */
export const SLOT_TYPE = {
    mainSlot: { groupId: 'mainSlot' },
    offSlot: { groupId: 'offSlot' },
    armorSlot: { groupId: 'armorSlot' },
    accessorySlot: { groupId: 'accessorySlot' }
}
