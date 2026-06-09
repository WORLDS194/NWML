/**
 * AML1 (Advanced Markup Language 1) Core Engine
 * Version 1.3.0 - Iframe & Local Bypass Edition
 * Eliminates the fetch() dependency so the language can execute anywhere.
 */

document.addEventListener("DOMContentLoaded", () => {
    try {
        // 1. Instantly grab the raw markup straight from the document body memory
        // This eliminates the 'about:srcdoc' fetch network error completely!
        const rawText = document.body.innerHTML;

        // 2. Run the code through our parsing pipeline
        const tokens = tokenizeAML(rawText);
        const ast = parseAML(tokens);

        // 3. Purge the plain text view and inject the luxury dark-mode system
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
            // Ignore the engine runtime script tag completely
            if (tag.toLowerCase().includes('script') && tag.includes('language.js')) continue;
            
            const isClosing = tag.startsWith('</');
            const name = tag.replace(/[<>\/]/g, '').split(' ')[0].toLowerCase();
            tokens.push({ type: isClosing ? 'CLOSE_TAG' : 'OPEN_TAG', name: name });
        } else if (text && text.trim()) {
            // Fix HTML entity escaping that browsers sometimes do inside body memory
            const cleanText = text.trim()
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
            tokens.push({ type: 'TEXT', value: cleanText });
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
        // Inject smooth animations directly into the runtime head
        if (!document.getElementById('aml-core-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'aml-core-styles';
            styleSheet.innerText = `
                @keyframes amlFadeUp {
                    from { opacity: 0; transform: translateY(15px); filter: blur(4px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                .aml-animate { animation: amlFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
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
                    element.style.fontSize = '3rem';
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
                    element.style.maxWidth = '640px';
                    element.style.boxShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.5)';
                    element.style.lineHeight = '1.7';
                    element.style.fontSize = '1.1rem';
                    element.style.color = '#e5e7eb';
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
                    element.style.width = '100%';
                    element.style.maxWidth = '640px';
            }

            targetContainer.appendChild(element);
            renderAML(child, element); 
        } else if (child.type === 'TextNode') {
            targetContainer.appendChild(document.createTextNode(child.value));
        }
    });
}
