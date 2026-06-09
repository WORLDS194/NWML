/**
 * NWML (New Web Making Language) Core Engine
 * Production Version 1.0.0 - Full Feature Complete Edition
 * Architecture: Tokenizer -> AST Parser -> Interactive Rendering Engine
 */

document.addEventListener("DOMContentLoaded", () => {
    try {
        // Read raw NWML content straight from body memory to bypass iframe sandboxes
        const rawText = document.body.innerHTML;
        const tokens = tokenizeNWML(rawText);
        const ast = parseNWML(tokens);
        renderNWML(ast, document.documentElement);
    } catch (err) {
        console.error("NWML Core Engine Panic:", err);
    }
});

/**
 * Tokenizer / Lexer
 * Extracts tags and separating content blocks out of the raw NWML stream.
 */
function tokenizeNWML(rawText) {
    const tokens = [];
    const regex = /(<\/?[a-zA-Z1-9\-]+(?: [^>]+)?>)|([^<]+)/g;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
        const [full, tag, text] = match;
        if (tag) {
            // Bypass the runtime network bootloader engine script tag
            if (tag.toLowerCase().includes('script') && tag.includes('language.js')) continue;
            
            const isClosing = tag.startsWith('</');
            const tagContent = tag.replace(/[<>\/]/g, '');
            const name = tagContent.split(' ')[0].toLowerCase();
            const attrString = tagContent.substring(name.length).trim();

            tokens.push({ 
                type: isClosing ? 'CLOSE_TAG' : 'OPEN_TAG', 
                name: name,
                attributes: parseNWMLAttributes(attrString)
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

/**
 * Attribute Parser
 * Extracts inline configurations like cols="2", align="center", src="...", or href="..."
 */
function parseNWMLAttributes(attrString) {
    const attrs = {};
    if (!attrString) return attrs;
    const regex = /([a-zA-Z\-]+)=(?:"([^"]*)"|'([^']*)'|([^ ]+))/g;
    let match;
    while ((match = regex.exec(attrString)) !== null) {
        attrs[match[1]] = match[2] || match[3] || match[4];
    }
    return attrs;
}

/**
 * AST Parser
 * Builds a structured layout hierarchy tree from sequential tokens.
 */
function parseNWML(tokens) {
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

/**
 * Universal Style Parameter Mapper
 */
function applyNWMLGlobalAttributes(element, attributes) {
    if (!attributes) return;
    if (attributes['align']) element.style.textAlign = attributes['align'];
    if (attributes['size']) {
        if (attributes['size'] === 'small') element.style.fontSize = '0.9rem';
        if (attributes['size'] === 'large') element.style.fontSize = '1.35rem';
        if (attributes['size'] === 'huge') element.style.fontSize = '2.2rem';
    }
}

/**
 * NWML High-Fidelity Design Rendering System
 */
function renderNWML(node, targetContainer) {
    if (node.type === 'Root') {
        // Inject modern global animations and utility variables into the head
        if (!document.getElementById('nwml-core-shaders')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'nwml-core-shaders';
            styleSheet.innerText = `
                @keyframes nwmlFloatUp {
                    from { opacity: 0; transform: translateY(16px); filter: blur(4px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                .nw-animate { animation: nwmlFloatUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .nw-hover-btn:hover { transform: translateY(-2px); background: #60a5fa !important; box-shadow: 0 0 25px rgba(56, 189, 248, 0.45) !important; }
                .nw-hover-btn:active { transform: translateY(1px); }
                .nw-input-field:focus { outline: none; border-color: #38bdf8 !important; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
                * { box-sizing: border-box; margin: 0; padding: 0; }
            `;
            document.head.appendChild(styleSheet);
        }

        // Wipe default unstyled HTML view and build the rich canvas
        targetContainer.innerHTML = ''; 
        targetContainer.style.backgroundColor = '#030712'; 
        targetContainer.style.backgroundImage = 'radial-gradient(circle at 50% -25%, #1e1b4b 0%, #030712 80%)';
        targetContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        targetContainer.style.color = '#f9fafb'; 
        targetContainer.style.padding = '70px 24px';
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
                case 'nw-title':
                    element = document.createElement('h1');
                    element.className = 'nw-animate';
                    element.style.fontSize = '3.4rem';
                    element.style.fontWeight = '900';
                    element.style.letterSpacing = '-0.04em';
                    element.style.background = 'linear-gradient(to right, #38bdf8, #818cf8)';
                    element.style.webkitBackgroundClip = 'text';
                    element.style.webkitTextFillColor = 'transparent';
                    element.style.margin = '0 0 12px 0';
                    element.style.textAlign = 'center';
                    break;
                    
                case 'nw-box':
                    element = document.createElement('div');
                    element.className = 'nw-animate';
                    element.style.background = 'rgba(17, 24, 39, 0.75)'; 
                    element.style.backdropFilter = 'blur(12px)';
                    element.style.webkitBackdropFilter = 'blur(12px)';
                    element.style.border = '1px solid rgba(51, 65, 85, 0.45)';
                    element.style.padding = '30px';
                    element.style.borderRadius = '22px';
                    element.style.width = '100%';
                    element.style.boxShadow = '0 25px 45px -15px rgba(0, 0, 0, 0.6)';
                    element.style.lineHeight = '1.75';
                    element.style.color = '#e5e7eb';
                    element.style.display = 'flex';
                    element.style.flexDirection = 'column';
                    element.style.gap = '12px'; // Prevents internal child clipping
                    
                    if (targetContainer.className !== 'nw-grid-layout' && targetContainer.className !== 'nw-card-body') {
                        element.style.maxWidth = '680px';
                    }
                    break;

                case 'nw-grid':
                    element = document.createElement('div');
                    element.className = 'nw-animate nw-grid-layout';
                    element.style.display = 'grid';
                    const columns = child.attributes['cols'] || '1';
                    element.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
                    element.style.gap = '24px';
                    element.style.width = '100%';
                    element.style.maxWidth = '1040px';
                    element.style.marginTop = '8px';
                    break;

                case 'nw-btn':
                case 'nw-submit':
                    element = document.createElement('a');
                    element.className = 'nw-animate nw-hover-btn';
                    element.href = child.attributes['href'] || '#';
                    element.style.display = 'inline-block';
                    element.style.textDecoration = 'none';
                    element.style.background = child.name === 'nw-submit' ? '#34d399' : '#38bdf8';
                    element.style.color = '#030712';
                    element.style.fontWeight = '750';
                    element.style.padding = '12px 26px';
                    element.style.borderRadius = '14px';
                    element.style.marginTop = '12px';
                    element.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.cursor = 'pointer';
                    element.style.textAlign = 'center';
                    element.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.25)';
                    break;

                case 'nw-input':
                    element = document.createElement('input');
                    element.type = 'text';
                    element.className = 'nw-animate nw-input-field';
                    element.placeholder = child.attributes['placeholder'] || 'Enter input...';
                    element.style.width = '100%';
                    element.style.background = 'rgba(31, 41, 55, 0.5)';
                    element.style.border = '1px solid rgba(75, 85, 99, 0.5)';
                    element.style.padding = '14px 18px';
                    element.style.borderRadius = '14px';
                    element.style.color = '#ffffff';
                    element.style.fontSize = '1rem';
                    element.style.transition = 'all 0.2s ease';
                    element.style.marginTop = '4px';
                    break;

                case 'nw-image':
                    element = document.createElement('img');
                    element.className = 'nw-animate';
                    element.src = child.attributes['src'] || '';
                    element.alt = child.attributes['alt'] || 'NWML Media asset';
                    element.style.width = '100%';
                    element.style.height = 'auto';
                    element.style.borderRadius = '16px';
                    element.style.border = '1px solid rgba(255,255,255,0.1)';
                    element.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
                    element.style.marginTop = '10px';
                    element.style.display = 'block';
                    break;

                case 'nw-alert':
                    element = document.createElement('div');
                    element.className = 'nw-animate';
                    const type = child.attributes['type'] || 'success';
                    element.style.width = '100%';
                    element.style.maxWidth = '680px';
                    element.style.padding = '16px 20px';
                    element.style.borderRadius = '14px';
                    element.style.fontWeight = '600';
                    element.style.marginTop = '10px';
                    if (type === 'warn') {
                        element.style.background = 'rgba(245, 158, 11, 0.15)';
                        element.style.border = '1px solid rgba(245, 158, 11, 0.4)';
                        element.style.color = '#fbbf24';
                    } else { 
                        element.style.background = 'rgba(52, 211, 153, 0.15)';
                        element.style.border = '1px solid rgba(52, 211, 153, 0.4)';
                        element.style.color = '#34d399';
                    }
                    break;

                case 'nw-card':
                    element = document.createElement('div');
                    element.className = 'nw-animate';
                    element.style.width = '100%';
                    element.style.maxWidth = '680px';
                    element.style.background = 'rgba(31, 41, 55, 0.4)';
                    element.style.border = '1px solid rgba(255,255,255,0.08)';
                    element.style.borderRadius = '16px';
                    element.style.overflow = 'hidden';
                    element.style.marginTop = '10px';

                    const header = document.createElement('div');
                    header.innerText = child.attributes['title'] || 'Click to Expand';
                    header.style.padding = '16px 20px';
                    header.style.background = 'rgba(255,255,255,0.04)';
                    header.style.cursor = 'pointer';
                    header.style.fontWeight = '700';
                    header.style.display = 'flex';
                    header.style.justifyContent = 'space-between';
                    header.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    
                    const body = document.createElement('div');
                    body.className = 'nw-card-body';
                    body.style.padding = '20px';
                    body.style.display = 'none'; 
                    body.style.flexDirection = 'column';
                    body.style.gap = '12px';

                    header.addEventListener('click', () => {
                        const isHidden = body.style.display === 'none';
                        body.style.display = isHidden ? 'flex' : 'none';
                        header.style.background = isHidden ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255,255,255,0.04)';
                    });

                    element.appendChild(header);
                    element.appendChild(body);
                    targetContainer.appendChild(element);
                    
                    renderNWML(child, body);
                    return; 

                case 'nw-glow':
                    element = document.createElement('span');
                    element.style.color = '#ffffff';
                    element.style.textShadow = '0 0 14px rgba(129, 140, 248, 0.65), 0 0 28px rgba(129, 140, 248, 0.35)';
                    element.style.fontWeight = '800';
                    break;

                case 'nw-stat':
                    element = document.createElement('span');
                    element.style.background = 'rgba(56, 189, 248, 0.12)';
                    element.style.border = '1px solid rgba(56, 189, 248, 0.45)';
                    element.style.color = '#38bdf8';
                    element.style.fontWeight = '700';
                    element.style.fontSize = '0.8rem';
                    element.style.textTransform = 'uppercase';
                    element.style.letterSpacing = '0.06em';
                    element.style.padding = '5px 14px';
                    element.style.borderRadius = '100px';
                    element.style.marginRight = '12px';
                    element.style.display = 'inline-block';
                    element.style.width = 'fit-content';
                    break;
                    
                default:
                    element = document.createElement('div');
                    element.className = 'nw-animate';
                    if (targetContainer.className !== 'nw-grid-layout' && targetContainer.className !== 'nw-card-body') {
                        element.style.width = '100%';
                        element.style.maxWidth = '680px';
                    }
            }

            applyNWMLGlobalAttributes(element, child.attributes);
            targetContainer.appendChild(element);
            renderNWML(child, element); 
        } else if (child.type === 'TextNode') {
            targetContainer.appendChild(document.createTextNode(child.value));
        }
    });
}
