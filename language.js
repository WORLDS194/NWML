/**
 * AML1 (Advanced Markup Language 1) Core Engine
 * Open-Source Hyper-Extended Version
 * Intercepts, parses, and implements advanced native layout systems.
 */

document.addEventListener("DOMContentLoaded", () => {
    fetch(window.location.href)
        .then(response => response.text())
        .then(rawText => {
            const tokens = tokenizeAML(rawText);
            const ast = parseAML(tokens);
            renderAML(ast, document.documentElement);
            initializeInteractiveElements(); // Run native event loops for new tags
        })
        .catch(err => console.error("AML1 Core Engine Exception:", err));
});

function tokenizeAML(rawText) {
    const tokens = [];
    const regex = /(<\/?[a-zA-Z1-9\-]+(?: [^>]+)?>)|([^<]+)/g;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
        const [full, tag, text] = match;
        if (tag) {
            if (tag.toLowerCase().includes('script') && tag.includes('script.js')) continue;
            
            const isClosing = tag.startsWith('</');
            // Isolate tag name and extract full raw tag attributes string
            const tagContent = tag.replace(/[<>\/]/g, '');
            const name = tagContent.split(' ')[0].toLowerCase();
            const attrString = tagContent.substring(name.length).trim();

            tokens.push({ 
                type: isClosing ? 'CLOSE_TAG' : 'OPEN_TAG', 
                name: name,
                attributes: parseAttributes(attrString)
            });
        } else if (text && text.trim()) {
            tokens.push({ type: 'TEXT', value: text.trim() });
        }
    }
    return tokens;
}

function parseAttributes(attrString) {
    const attrs = {};
    if (!attrString) return attrs;
    const regex = /([a-zA-Z\-]+)=(?:"([^"]*)"|'([^']*)'|([^ ]+))/g;
    let match;
    while ((match = regex.exec(attrString)) !== null) {
        attrs[match[1]] = match[2] || match[3] || match[4];
    }
    return attrs;
}

function parseAML(tokens) {
    let root = { type: 'Root', children: [] };
    let currentParent = root;
    let stack = [root];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === 'OPEN_TAG') {
            let node = { type: 'Element', name: token.name, attributes: token.attributes, children: [] };
            currentParent.children.push(node);
            stack.push(node);
            currentParent = node;
        } else if (token.type === 'CLOSE_TAG') {
            stack.pop();
            currentParent = stack[stack.length - 1] || root;
        } else if (token.type === 'TEXT') {
            currentParent.children.push({ type: 'TextNode', value: token.value });
        }
    }
    return root;
}

function renderAML(node, targetContainer) {
    if (node.type === 'Root') {
        targetContainer.innerHTML = ''; 
        targetContainer.style.backgroundColor = '#0b0f19'; 
        targetContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        targetContainer.style.color = '#e2e8f0';
        targetContainer.style.padding = '40px';
        targetContainer.style.minHeight = '100vh';
        targetContainer.style.boxSizing = 'border-box';
    }

    node.children?.forEach(child => {
        if (child.type === 'Element') {
            let element;
            
            switch(child.name) {
                case 'aml-title':
                    element = document.createElement('h1');
                    element.style.color = '#38bdf8';
                    element.style.fontSize = '2.4rem';
                    element.style.borderBottom = '2px solid #1e293b';
                    element.style.paddingBottom = '12px';
                    break;
                    
                case 'aml-box':
                    element = document.createElement('div');
                    element.style.background = '#1e293b';
                    element.style.border = '1px solid #334155';
                    element.style.padding = '24px';
                    element.style.borderRadius = '12px';
                    element.style.marginTop = '20px';
                    break;

                case 'aml-toggle':
                    element = document.createElement('label');
                    element.style.display = 'inline-flex';
                    element.style.alignItems = 'center';
                    element.style.cursor = 'pointer';
                    element.style.gap = '10px';
                    element.style.marginTop = '10px';
                    
                    const hiddenCheck = document.createElement('input');
                    hiddenCheck.type = 'checkbox';
                    hiddenCheck.style.display = 'none';
                    
                    const switchTrack = document.createElement('div');
                    switchTrack.style.width = '44px';
                    switchTrack.style.height = '24px';
                    switchTrack.style.background = '#334155';
                    switchTrack.style.borderRadius = '12px';
                    switchTrack.style.position = 'relative';
                    switchTrack.style.transition = '0.3s';

                    const switchThumb = document.createElement('div');
                    switchThumb.style.width = '18px';
                    switchThumb.style.height = '18px';
                    switchThumb.style.background = '#white';
                    switchThumb.style.borderRadius = '50%';
                    switchThumb.style.position = 'absolute';
                    switchThumb.style.top = '3px';
                    switchThumb.style.left = '3px';
                    switchThumb.style.transition = '0.3s';
                    switchThumb.style.backgroundColor = '#e2e8f0';

                    switchTrack.appendChild(switchThumb);
                    element.appendChild(hiddenCheck);
                    element.appendChild(switchTrack);

                    hiddenCheck.addEventListener('change', () => {
                        if(hiddenCheck.checked) {
                            switchTrack.style.background = '#38bdf8';
                            switchThumb.style.transform = 'translateX(20px)';
                        } else {
                            switchTrack.style.background = '#334155';
                            switchThumb.style.transform = 'translateX(0)';
                        }
                    });
                    break;

                case 'aml-popover':
                    element = document.createElement('div');
                    element.style.position = 'relative';
                    element.style.display = 'inline-block';
                    element.style.marginTop = '15px';

                    const trigger = document.createElement('button');
                    trigger.innerText = child.attributes['trigger'] || 'Open Popover';
                    trigger.style.background = '#38bdf8';
                    trigger.style.color = '#0b0f19';
                    trigger.style.border = 'none';
                    trigger.style.padding = '8px 16px';
                    trigger.style.borderRadius = '6px';
                    trigger.style.fontWeight = 'bold';
                    trigger.style.cursor = 'pointer';

                    const content = document.createElement('div');
                    content.style.display = 'none';
                    content.style.position = 'absolute';
                    content.style.top = '110%';
                    content.style.left = '0';
                    content.style.background = '#0f172a';
                    content.style.border = '1px solid #38bdf8';
                    content.style.padding = '12px';
                    content.style.borderRadius = '6px';
                    content.style.zIndex = '100';
                    content.style.minWidth = '200px';

                    trigger.addEventListener('click', (e) => {
                        e.stopPropagation();
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    });

                    document.addEventListener('click', () => content.style.display = 'none');

                    element.appendChild(trigger);
                    element.appendChild(content);
                    // Point children render pass to the inner content window
                    renderAML(child, content);
                    return;

                case 'aml-tabs':
                    element = document.createElement('div');
                    element.className = 'aml-tabs-container';
                    element.style.marginTop = '20px';
                    
                    const tabHeader = document.createElement('div');
                    tabHeader.className = 'aml-tab-headers';
                    tabHeader.style.display = 'flex';
                    tabHeader.style.gap = '5px';
                    tabHeader.style.borderBottom = '1px solid #334155';
                    
                    const tabContentArea = document.createElement('div');
                    tabContentArea.className = 'aml-tab-panes';
                    tabContentArea.style.padding = '15px 0';

                    element.appendChild(tabHeader);
                    element.appendChild(tabContentArea);

                    // Defer child rendering to structural parsing
                    child.children.forEach((tabChild, idx) => {
                        if (tabChild.name === 'aml-tab') {
                            const btn = document.createElement('button');
                            btn.innerText = tabChild.attributes['label'] || `Tab ${idx+1}`;
                            btn.style.background = idx === 0 ? '#1e293b' : 'transparent';
                            btn.style.color = idx === 0 ? '#38bdf8' : '#94a3b8';
                            btn.style.border = '1px solid #334155';
                            btn.style.borderBottom = idx === 0 ? '1px solid #1e293b' : 'none';
                            btn.style.padding = '8px 16px';
                            btn.style.cursor = 'pointer';
                            btn.style.borderTopLeftRadius = '6px';
                            btn.style.borderTopRightRadius = '6px';

                            const pane = document.createElement('div');
                            pane.style.display = idx === 0 ? 'block' : 'none';
                            
                            renderAML(tabChild, pane);
                            tabContentArea.appendChild(pane);

                            btn.addEventListener('click', () => {
                                Array.from(tabHeader.children).forEach(b => {
                                    b.style.background = 'transparent';
                                    b.style.color = '#94a3b8';
                                });
                                Array.from(tabContentArea.children).forEach(p => p.style.display = 'none');
                                
                                btn.style.background = '#1e293b';
                                btn.style.color = '#38bdf8';
                                pane.style.display = 'block';
                            });
                            tabHeader.appendChild(btn);
                        }
                    });
                    targetContainer.appendChild(element);
                    return;

                default:
                    element = document.createElement('div');
            }

            targetContainer.appendChild(element);
            renderAML(child, element); 
        } else if (child.type === 'TextNode') {
            targetContainer.appendChild(document.createTextNode(child.value));
        }
    });
}

function initializeInteractiveElements() {
    // Global hook for dynamic cleanup tasks or lifecycle listeners
}
