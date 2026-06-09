/**
 * AML1 (Advanced Markup Language 1) Core Engine
 * Open-Source Production Version 1.2.0 - Premium UI Upgrade
 * Intercepts, tokenizes, and applies high-end modern layout geometry.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inject global luxury styling and entry animations into the document head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes amlFadeUp {
            from { opacity: 0; transform: translateY(20px); filter: blur(5px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .aml-animate {
            animation: amlFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; }
    `;
    document.head.appendChild(styleSheet);

    fetch(window.location.href)
        .then(response => response.text())
        .then(rawText => {
            const tokens = tokenizeAML(rawText);
            const ast = parseAML(tokens);
            renderAML(ast, document.documentElement);
        })
        .catch(err => console.error("AML1 Core Engine Kernel Panic:", err));
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
            const name = tag.replace(/[<>\/]/g, '').split(' ')[0].toLowerCase();
            tokens.push({ type: isClosing ? 'CLOSE_TAG' : 'OPEN_TAG', name: name });
        } else if (text && text.trim()) {
            tokens.push({ type: 'TEXT', value: text.trim() });
        }
    }
    return tokens;
}

function parseAML(tokens) {
    let root = { type: 'Root', children: [] };
    let currentParent = root;
    let stack = [root];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === 'OPEN_TAG') {
            let node = { type: 'Element', name: token.name, children: [] };
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
        // Futuristic Cyber-Minimalist Canvas
        targetContainer.innerHTML = ''; 
        targetContainer.style.backgroundColor = '#030712'; // Ultra dark rich charcoal black
        targetContainer.style.backgroundImage = 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #030712 70%)'; // Elegant deep indigo ambient glow
        targetContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        targetContainer.style.color = '#f9fafb'; 
        targetContainer.style.padding = '80px 24px';
        targetContainer.style.minHeight = '100vh';
        targetContainer.style.display = 'flex';
        targetContainer.style.flexDirection = 'column';
        targetContainer.style.alignItems = 'center';
        targetContainer.style.gap = '24px';
    }

    node.children?.forEach(child => {
        if (child.type === 'Element') {
            let element;
            
            switch(child.name) {
                case 'aml-title':
                    element = document.createElement('h1');
                    element.className = 'aml-animate';
                    element.style.fontSize = '3.5rem';
                    element.style.fontWeight = '900';
                    element.style.letterSpacing = '-0.05em';
                    element.style.background = 'linear-gradient(to right, #38bdf8, #818cf8)'; // High-end text gradient
                    element.style.webkitBackgroundClip = 'text';
                    element.style.webkitTextFillColor = 'transparent';
                    element.style.margin = '0 0 16px 0';
                    element.style.textAlign = 'center';
                    break;
                    
                case 'aml-box':
                    element = document.createElement('div');
                    element.className = 'aml-animate';
                    // Premium Glassmorphic Card Styling
                    element.style.background = 'rgba(17, 24, 39, 0.7)'; 
                    element.style.backdropFilter = 'blur(16px)';
                    element.style.webkitBackdropFilter = 'blur(16px)';
                    element.style.border = '1px solid rgba(51, 65, 85, 0.5)'; // Soft, translucent border
                    element.style.padding = '32px';
                    element.style.borderRadius = '24px'; // Extra smooth roundness
                    element.style.width = '100%';
                    element.style.maxWidth = '680px';
                    // Deep custom drop shadow with subtle glowing edge accent
                    element.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05)';
                    element.style.lineHeight = '1.75';
                    element.style.fontSize = '1.15rem';
                    element.style.color = '#d1d5db'; // Soft gray readable text
                    break;

                case 'aml-stat':
                    element = document.createElement('span');
                    // Neon capsule indicator badge
                    element.style.background = 'rgba(56, 189, 248, 0.1)';
                    element.style.border = '1px solid rgba(56, 189, 248, 0.4)';
                    element.style.color = '#38bdf8';
                    element.style.fontWeight = '600';
                    element.style.fontSize = '0.85rem';
                    element.style.textTransform = 'uppercase';
                    element.style.letterSpacing = '0.05em';
                    element.style.padding = '6px 14px';
                    element.style.borderRadius = '100px';
                    element.style.marginRight = '12px';
                    element.style.display = 'inline-block';
                    break;
                    
                default:
                    element = document.createElement('div');
                    element.className = 'aml-animate';
                    element.style.width = '100%';
                    element.style.maxWidth = '680px';
                    element.style.fontSize = '1.05rem';
            }

            targetContainer.appendChild(element);
            renderAML(child, element); 
        } else if (child.type === 'TextNode') {
            targetContainer.appendChild(document.createTextNode(child.value));
        }
    });
}
