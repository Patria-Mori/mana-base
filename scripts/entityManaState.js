class EntityManaState {

    static getMana(actorId) {
        return game.actors.get(actorId)?.getFlag(Mana.ID, Mana.FLAGS.MANA_STATE);
    }

    static setMana(actorId, newManaVal) {
        return game.actors.get(actorId)?.setFlag(Mana.ID, Mana.FLAGS.MANA_STATE, newManaVal);
    }

    static unsetMana(actorId) {
        return game.actors.get(actorId)?.unsetFlag(Mana.ID, Mana.FLAGS.MANA_STATE);
    }

    static addManaSafe(actorId, manaDelta) {
        const newMana = this.getMana(actorId) + manaDelta;
        const manaCap = this.getManaProps(actorId).manaCap;
        return ((newMana > manaCap) ? this.setMana(actorId, manaCap) : this.setMana(actorId, newMana));
    }

    static addMana(actorId, manaDelta) {
        return this.setMana(actorId, (this.getMana(actorId) + manaDelta));
    }

    static removeMana(actorId, manaDelta) {
        const newMana = this.getMana(actorId) - manaDelta;
        return ((newMana < 0) ? this.setMana(0) : this.setMana(newMana));
    }

    static regenMana(actorId, ticks, overcharge) {
        const manaProps = this.getManaProps(actorId);
        const regMana = manaProps.manaRegen * ticks;
        const newMana = this.getMana(actorId) + regMana;
        
        const maxMana = overcharge ? manaProps.manaCap + manaProps.overchargeCap : manaProps.manaCap;
        return newMana > maxMana ? this.setMana(actorId, maxMana) : this.setMana(actorId, newMana);
    }

    static getManaProps(actorId) {
        return game.actors.get(actorId)?.getFlag(Mana.ID, Mana.FLAGS.MANA_PROPERTY);
    }

    /**
     * 
     * @param {string} actorId 
     * @param {ManaPropertyState} newManaProps Mana Properties.
     */
    static setManaProps(actorId, newManaProps) {
        return game.actors.get(actorId)?.setFlag(Mana.ID, Mana.FLAGS.MANA_PROPERTY, newManaProps);
    }

    static unsetManaProps(actorId) {
        return game.actors.get(actorId)?.unsetFlag(Mana.ID, Mana.FLAGS.MANA_PROPERTY);
    }

}

class ManaPropertyState {

    constructor(manaCap, overchargeCap, manaRegen, manaControl) {
        this.manaCap = manaCap;
        this.overchargeCap = overchargeCap;
        this.manaRegen = manaRegen;
        this.manaControl = manaControl;
    }

    get manaCap() {
        return this.manaCap;
    }

}