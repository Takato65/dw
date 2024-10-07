//FMC_Target='./All.js'
await dw.loadScript('dw://dw/index.js');;
import { SEARCH } from './SEARCH.js';
function TitleCase(txt) {
    let words = txt;
    if (txt.includes('_'))
        words = txt.replace(/_/g, ' ');
    words = words.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1").trim();

    return words.charAt(0).toUpperCase() + words.slice(1);
}

import { addButtonMenu } from './ui-menu-builder.js';
const menu = addButtonMenu("⚙️", "fecruzb Options");
const tabbar = menu.addTabGroup();
const configTab = tabbar.addTab("CONFIG");
// Reassign values using dw.get() and prefix with 'fe_' in the keys
for (const ckey in CONFIG) {
    CONFIG[ckey] = dw.get(`fe_${ckey}`) ?? CONFIG[ckey];
    configTab.addTextToggleButton("", TitleCase(ckey), () => {
        CONFIG[ckey] = !CONFIG[ckey]
        dw.set(`fe_${ckey}`, CONFIG[ckey])
    }, () => CONFIG[ckey])
}

//Skills Tab
const skillsTab = tabbar.addTab("SKILLS", true);
skillsTab.addScrollbar();

for (const skey in SKILLS) {
    const skill = SKILLS[skey];
    // Check if it's an object with properties or a direct value
    if (typeof skill === 'object' && skill !== null) {
        // If it's an object, it's a skill with props
        let skillGroup = skillsTab.UiInsetFrame();
        skillGroup = skillGroup.UiTitleBarToggleGroup(TitleCase(skey), false);
        // Loop through each property of the skill object
        for (const prop in skill) {
            if (skill.hasOwnProperty(prop)) {
                skill[prop] = dw.get(`fe_${skey}_${prop}`) ?? skill[prop];
                const value = skill[prop];
                const propName = TitleCase(prop);
                // Switch based on the type of the value
                switch (typeof value) {
                    case 'boolean':
                        //skill[prop] = dw.get(`fe_${skey}_${prop}`) ?? skill[prop];
                        // If it's a boolean, add a toggle button
                        skillGroup.addTextToggleButton("", TitleCase(prop), () => {
                            skill[prop] = !skill[prop];
                            dw.set(`fe_${skey}_${prop}`, skill[prop]);
                        }, () => skill[prop]);
                        break;
                    case 'number':
                        //const propString = `fe_${skey}_${prop}`;
                        //const propValue = dw.get(propString);
                        //skill[prop] = propValue ?? skill[prop];
                        // If it's a number, add a number input
                        let min = 0;
                        let max = null;
                        let step = 0.01;
                        if (prop === "index") {
                            max = 9;
                            step = 1;
                        }
                        else if (prop === "hpThreshold") {
                            min = 0.1;
                            max = 0.99;
                            step = 0.01;
                        }
                        skillGroup.addNumberInput(propName, value, min, max, step, dw, (newValue) => {
                            skill[prop] = newValue;
                            dw.set(`fe_${skey}_${prop}`, skill[prop]);
                        });
                        break;
                    case 'string':
                        skillGroup.addStatTextLabel(propName, value);
                        break;
                    default:
                        skillGroup.addStatTextLabel(propName, value);
                        break;
                }

            }
        }
    }
}

//SCORE TAB
const scoreTab = tabbar.addTab("SCORE", true);
scoreTab.addScrollbar();
for (const sckey in SCORE) {
    const score = SCORE[sckey];
    // Check if it's an object with properties or a direct value
    if (typeof score === 'object' && score !== null) {
        // If it's an object with props
        let scoreGroup = scoreTab.UiInsetFrame();
        scoreGroup = scoreGroup.UiTitleBarToggleGroup(TitleCase(sckey), false);
        // Loop through each property of the score object
        for (const prop in score) {
            if (score.hasOwnProperty(prop)) {
                score[prop] = dw.get(`fe_${sckey}_${prop}`) ?? score[prop];
                const value = score[prop];
                const propName = TitleCase(prop);
                // Switch based on the type of the value
                switch (typeof value) {
                    case 'boolean':
                        //score[prop] = dw.get(`fe_${sckey}_${prop}`) ?? score[prop];
                        // If it's a boolean, add a toggle button
                        scoreGroup.addTextToggleButton("", TitleCase(prop), () => {
                            score[prop] = !score[prop];
                            dw.set(`fe_${sckey}_${prop}`, score[prop]);
                        }, () => score[prop]);
                        break;
                    case 'number':
                        //score[prop] = dw.get(`fe_${sckey}_${prop}`) ?? score[prop];
                        // If it's a number, add a number input
                        let min = null;
                        let max = null;
                        let step = 1;
                        scoreGroup.addNumberInput(propName, value, min, max, step, dw, (newValue) => {
                            score[prop] = newValue;
                            dw.set(`fe_${sckey}_${prop}`, score[prop]);
                        });
                        break;
                    case 'string':
                        scoreGroup.addStatTextLabel(propName, value);
                        break;
                    default:
                        scoreGroup.addStatTextLabel(propName, value);
                        break;
                }

            }
        }
    }
}

function findItems(searchString) {
    if (!SEARCH.enable) return [];
    const result = [];

    dw.e.forEach(entity => {
        if (entity.owner && Array.isArray(entity.storage)) {
            const itemsArray = [];

            entity.storage.forEach(item => {
                // Check if item exists and has the required properties
                if (item && item.md && item.md.includes(searchString)) {
                    itemsArray.push({n:item.n ?? 1, q:item.qual}); // Add [n, q] to itemsArray
                }
            });

            // Only add to result if itemsArray has entries
            if (itemsArray.length > 0) {
                result.push({
                    e: entity,       // The whole entity object (once)
                    items: itemsArray // Array of [n, q] for the entity
                });
            }
        }
    });

    return result;
}

const searchMenu = addButtonMenu("🔍", "Search");
searchMenu.addTextToggleButton("", "Draw Search Results", () => {
    SEARCH.enable = !SEARCH.enable
    // if (SEARCH.enable && SEARCH.what !== '') {
    //     SEARCH.results = findItems(SEARCH.what);
    // }
    console.log(SEARCH);
}, () => SEARCH.enable);
searchMenu.addTextInput(null, null, "Search", (newValue) => {
    //console.log(SEARCH);
    if (SEARCH.what != newValue) {
        SEARCH.what = newValue;
        //if (SEARCH.enable) SEARCH.results = findItems(SEARCH.what);
    }
    //console.log(SEARCH);
},true)
function searchTimer(){
    if(SEARCH.enable)
        SEARCH.results = findItems(SEARCH.what);

    setTimeout(searchTimer,500)
}
searchTimer();
dw.on('drawEnd', (ctx) => {
    if (!SEARCH.enable || SEARCH.results.length < 1) return;
    // Loop through the woodEntities to draw boxes and text for each entity
    SEARCH.results.forEach(result => {
        const { e,items } = result;  // Destructure the result to get entity, n, and q
        const { w, h } = dw.getHitbox(e.md, Object.hasOwn(e,'v') ? e.v : 0)

        const x = dw.toCanvasX(e.x)
        const y = dw.toCanvasY(e.y - h)
        // Draw for the entity
        ctx.fillStyle = ctx.strokeStyle + '40'
        ctx.beginPath()
        ctx.rect(
          x - w * dw.constants.PX_PER_UNIT_ZOOMED / 2,
          y,
          w * dw.constants.PX_PER_UNIT_ZOOMED,
          h * dw.constants.PX_PER_UNIT_ZOOMED,
        )
        ctx.stroke()
        ctx.fill()

        // Set text color and font for drawing n and q
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial'; // Adjust font size and type as needed

        // Draw n (number) and q (quality) inside or near the red box
        var yText = 0
items.forEach(i => {
        //console.log(i);
        ctx.fillText(
            `${i.n},${i.q}`,
            dw.toCanvasX(e.x) + 5,
            dw.toCanvasY(e.y) + yText
        );
        yText = yText + 30; 
    });
    });
});

