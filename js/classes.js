var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Task = /** @class */ (function () {
    function Task(baseData) {
        this.baseData = baseData;
        this.name = baseData.name;
        this.level = 0;
        this.maxLevel = 0;
        this.xp = 0;
        this.xpMultipliers = [];
    }
    Task.prototype.getMaxXp = function () {
        var maxXp = Math.round(this.baseData.maxXp * (this.level + 1) * Math.pow(1.01, this.level));
        return maxXp;
    };
    Task.prototype.getXpLeft = function () {
        return Math.round(this.getMaxXp() - this.xp);
    };
    Task.prototype.getMaxLevelMultiplier = function () {
        var maxLevelMultiplier = 1 + this.maxLevel / 10;
        return maxLevelMultiplier;
    };
    Task.prototype.getXpGain = function () {
        return applyMultipliers(10, this.xpMultipliers);
    };
    Task.prototype.increaseXp = function () {
        this.xp += applySpeed(this.getXpGain());
        if (this.xp >= this.getMaxXp()) {
            var excess = this.xp - this.getMaxXp();
            while (excess >= 0) {
                this.level += 1;
                excess -= this.getMaxXp();
            }
            this.xp = this.getMaxXp() + excess;
        }
    };
    return Task;
}());
var Job = /** @class */ (function (_super) {
    __extends(Job, _super);
    function Job(baseData) {
        var _this = _super.call(this, baseData) || this;
        _this.incomeMultipliers = [];
        return _this;
    }
    Job.prototype.getLevelMultiplier = function () {
        var levelMultiplier = 1 + Math.log10(this.level + 1);
        return levelMultiplier;
    };
    Job.prototype.getIncome = function () {
        return applyMultipliers(this.baseData.income, this.incomeMultipliers);
    };
    return Job;
}(Task));
var Skill = /** @class */ (function (_super) {
    __extends(Skill, _super);
    function Skill(baseData) {
        return _super.call(this, baseData) || this;
    }
    Skill.prototype.getEffect = function () {
        var effect = 1 + this.baseData.effect * this.level;
        return effect;
    };
    Skill.prototype.getEffectDescription = function () {
        var description = this.baseData.description;
        var text = 'x' + String(this.getEffect().toFixed(2)) + ' ' + description;
        return text;
    };
    return Skill;
}(Task));
var Item = /** @class */ (function () {
    function Item(baseData) {
        this.baseData = baseData;
        this.name = baseData.name;
        this.expenseMultipliers = [];
    }
    Item.prototype.getEffect = function () {
        if (gameData.currentProperty != this &&
            !gameData.currentMisc.includes(this))
            return 1;
        var effect = this.baseData.effect;
        return effect;
    };
    Item.prototype.getEffectDescription = function () {
        var description = this.baseData.description;
        if (itemCategories['Properties'].includes(this.name))
            description = 'Happiness';
        var text = 'x' + this.baseData.effect.toFixed(1) + ' ' + description;
        return text;
    };
    Item.prototype.getExpense = function () {
        return applyMultipliers(this.baseData.expense, this.expenseMultipliers);
    };
    return Item;
}());
var Requirement = /** @class */ (function () {
    function Requirement(elements, requirements) {
        this.elements = elements;
        this.requirements = requirements;
        this.completed = false;
    }
    Requirement.prototype.isCompleted = function () {
        if (this.completed) {
            return true;
        }
        for (var _i = 0, _a = this.requirements; _i < _a.length; _i++) {
            var requirement = _a[_i];
            if (!this.getCondition(requirement)) {
                return false;
            }
        }
        this.completed = true;
        return true;
    };
    return Requirement;
}());
var TaskRequirement = /** @class */ (function (_super) {
    __extends(TaskRequirement, _super);
    function TaskRequirement(elements, requirements) {
        var _this = _super.call(this, elements, requirements) || this;
        _this.type = 'task';
        return _this;
    }
    TaskRequirement.prototype.getCondition = function (requirement) {
        return (gameData.taskData[requirement.task].level >= requirement.requirement);
    };
    return TaskRequirement;
}(Requirement));
var CoinRequirement = /** @class */ (function (_super) {
    __extends(CoinRequirement, _super);
    function CoinRequirement(elements, requirements) {
        var _this = _super.call(this, elements, requirements) || this;
        _this.type = 'coins';
        return _this;
    }
    CoinRequirement.prototype.getCondition = function (requirement) {
        return gameData.coins >= requirement.requirement;
    };
    return CoinRequirement;
}(Requirement));
var AgeRequirement = /** @class */ (function (_super) {
    __extends(AgeRequirement, _super);
    function AgeRequirement(elements, requirements) {
        var _this = _super.call(this, elements, requirements) || this;
        _this.type = 'age';
        return _this;
    }
    AgeRequirement.prototype.getCondition = function (requirement) {
        return daysToYears(gameData.days) >= requirement.requirement;
    };
    return AgeRequirement;
}(Requirement));
var EvilRequirement = /** @class */ (function (_super) {
    __extends(EvilRequirement, _super);
    function EvilRequirement(elements, requirements) {
        var _this = _super.call(this, elements, requirements) || this;
        _this.type = 'evil';
        return _this;
    }
    EvilRequirement.prototype.getCondition = function (requirement) {
        return gameData.evil >= requirement.requirement;
    };
    return EvilRequirement;
}(Requirement));
var EssenceRequirement = /** @class */ (function (_super) {
    __extends(EssenceRequirement, _super);
    function EssenceRequirement(elements, requirements) {
        var _this = _super.call(this, elements, requirements) || this;
        _this.type = 'essence';
        return _this;
    }
    EssenceRequirement.prototype.getCondition = function (requirement) {
        return gameData.essence >= requirement.requirement;
    };
    return EssenceRequirement;
}(Requirement));
//# sourceMappingURL=classes.js.map