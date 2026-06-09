/**
 * AML1 (Advanced Markup Language 1) Core Engine
 * Version 1.4.0 - Ultra Feature Expansion Pack
 * Includes automated multi-column grids, interactive buttons, 
 * smart typography parameters, and glow shaders.
 */

document.addEventListener("DOMContentLoaded", () => {
    try {
        const rawText = document.body.innerHTML;
        const tokens = tokenizeAML(rawText);
        const ast = parseAML(tokens);
        renderAML(ast, document.documentElement);
    } catch (err) {
        console.error("AML1 Core Engine Kernel Panic:", err);
    }
});

function tokenizeAML(rawText) {
    const tokens = [];
    const regex = /(<\/?[a-zA-Z1-9\-]+(?: [^>]+)?>)|([^<]+)/g;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
        const [full, tag, text] = match;
        if (tag) {
            if (tag.toLowerCase().includes('script') && tag.includes('language.js')) continue;
            
            const isClosing = tag.startsWith('</');
            const tagContent = tag.replace(/[<>\/]/g, '');
            const name = tagContent.split(' ')[0].toLowerCase();
            const attrString = tagContent.substring(name.length).trim();

            tokens.push({ 
                type: isClosing ? 'CLOSE_TAG' : 'OPEN_TAG', 
                name: name,
                attributes: parseAttributes(attrString)
            });
        } else if (text && text.trim()) {
            const cleanText = text.trim()
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
            tokens.push({ type: 'TEXT', value: cleanText });
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

function applyUniversalStyles(element, attributes) {
    if (!attributes) return;
    
    // Text Alignment Utility
    if (attributes['align']) {
        element.style.textAlign = attributes['align'];
    }
    // Size Modifiers
    if (attributes['size']) {
        if (attributes['size'] === 'small') element.style.fontSize = '0.9rem';
        if (attributes['size'] === 'large') element.style.fontSize = '1.4rem';
        if (attributes['size'] === 'huge') element.style.fontSize = '2.2rem';
    }
}

function renderAML(node, targetContainer) {
    if (node.type === 'Root') {
        if (!document.getElementById('aml-core-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'aml-core-styles';
            styleSheet.innerText = `
                @keyframes amlFadeUp {
                    from { opacity: 0; transform: translateY(15px); filter: blur(4px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                .aml-animate { animation: amlFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .aml-button:hover { transform: translateY(-2px); background: #60a5fa !important; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4) !important; }
                .aml-button:active { transform: translateY(1px); }
                * { box-sizing: border-box; margin: 0; padding: 0; }
            `;
            document.head.appendChild(styleSheet);
        }

        targetContainer.innerHTML = ''; 
        targetContainer.style.backgroundColor = '#030712'; 
        targetContainer.style.backgroundImage = 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #030712 75%)';
        targetContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        targetContainer.style.color = '#f9fafb'; 
        targetContainer.style.padding = '60px 20px';
        targetContainer.style.minHeight = '100vh';
        targetContainer.style.display = 'flex';
        targetContainer.style.flexDirection = 'column';
        targetContainer.style.alignItems = 'center';
        targetContainer.style.gap = '20px';
    }

    node.children?.forEach(child => {
        if (child.type === 'Element') {
            let element;
            
            switch(child.name) {
                case 'aml-title':
                    element = document.createElement('h1');
                    element.className = 'aml-animate';
                    element.style.fontSize = '3.2rem';
                    element.style.fontWeight = '900';
                    element.style.letterSpacing = '-0.04em';
                    element.style.background = 'linear-gradient(to right, #38bdf8, #818cf8)';
                    element.style.webkitBackgroundClip = 'text';
                    element.style.webkitTextFillColor = 'transparent';
                    element.style.margin = '0 0 10px 0';
                    element.style.textAlign = 'center';
                    break;
                    
                case 'aml-box':
                    element = document.createElement('div');
                    element.className = 'aml-animate';
                    element.style.background = 'rgba(17, 24, 39, 0.7)'; 
                    element.style.backdropFilter = 'blur(12px)';
                    element.style.webkitBackdropFilter = 'blur(12px)';
                    element.style.border = '1px solid rgba(51, 65, 85, 0.4)';
                    element.style.padding = '28px';
                    element.style.borderRadius = '20px';
                    element.style.width = '100%';
                    element.style.boxShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.5)';
                    element.style.lineHeight = '1.7';
                    element.style.color = '#e5e7eb';
                    
                    // If not inside a grid layout, cap width nicely
                    if (targetContainer.className !== 'aml-grid-container') {
                        element.style.maxWidth = '680px';
                    }
                    break;

                case 'aml-grid':
                    element = document.createElement('div');
                    element.className = 'aml-animate aml-grid-container';
                    element.style.display = 'grid';
                    // Dynamic layout generation mapping: e.g., cols="2" turns into two symmetric side-by-side grids
                    const columnsCount = child.attributes['cols'] || '1';
                    element.style.gridTemplateColumns = `repeat(${columnsCount}, minmax(0, 1fr))`;
                    element.style.gap = '20px';
                    element.style.width = '100%';
                    element.style.maxWidth = '1000px';
                    element.style.marginTop = '10px';
                    break;

                case 'aml-btn':
                    element = document.createElement('a');
                    element.className = 'aml-animate aml-button';
                    element.href = child.attributes['href'] || '#';
                    element.style.display = 'inline-block';
                    element.style.textDecoration = 'none';
                    element.style.background = '#38bdf8';
                    element.style.color = '#030712';
                    element.style.fontWeight = '700';
                    element.style.padding = '12px 24px';
                    element.style.borderRadius = '12px';
                    element.style.marginTop = '15px';
                    element.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.cursor = 'pointer';
                    element.style.boxShadow = '0 4px 6px -1px rgba(56, 189, 248, 0.2)';
                    break;

                case 'aml-glow':
                    element = document.createElement('span');
                    element.style.color = '#ffffff';
                    element.style.textShadow = '0 0 12px rgba(129, 140, 248, 0.6), 0 0 24px rgba(129, 140, 248, 0.3)';
                    element.style.fontWeight = 'bold';
                    break;

                case 'aml-stat':
                    element = document.createElement('span');
                    element.style.background = 'rgba(56, 189, 248, 0.1)';
                    element.style.border = '1px solid rgba(56, 189, 248, 0.4)';
                    element.style.color = '#38bdf8';
                    element.style.fontWeight = '700';
                    element.style.fontSize = '0.8rem';
                    element.style.textTransform = 'uppercase';
                    element.style.letterSpacing = '0.05em';
                    element.style.padding = '4px 12px';
                    element.style.borderRadius = '100px';
                    element.style.marginRight = '10px';
                    element.style.display = 'inline-block';
                    break;
                    
                default:
                    element = document.createElement('div');
                    element.className = 'aml-animate';
                    if (targetContainer.className !== 'aml-grid-container') {
                        element.style.width = '100%';
                        element.style.maxWidth = '680px';
                    }
            }

            // Bind global parameters
            applyUniversalStyles(element, child.attributes);

            targetContainer.appendChild(element);
            renderAML(child, element); 
        } else if (child.type === 'TextNode') {
            targetContainer.appendChild(document.createTextNode(child.value));
        }
    });
}
