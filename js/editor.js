export class Editor {
    constructor() {
        this.textarea = document.getElementById('code-editor');
        this.runBtn = document.getElementById('run-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.exampleSelect = document.getElementById('example-select');
        this.lineNumbers = document.querySelector('.line-numbers');

        this.onRun = null;
        this.onReset = null;
        this.onExampleLoad = null;

        this.bindEvents();
        this.updateLineNumbers();
    }

    bindEvents() {
        this.runBtn.addEventListener('click', () => {
            if (this.onRun) this.onRun(this.textarea.value);
        });

        this.resetBtn.addEventListener('click', () => {
            if (this.onReset) this.onReset();
        });

        this.exampleSelect.addEventListener('change', (e) => {
            if (this.onExampleLoad && e.target.value) {
                this.onExampleLoad(e.target.value);
                this.exampleSelect.value = ""; // Reset select
            }
        });

        this.textarea.addEventListener('input', () => {
            this.updateLineNumbers();
        });

        this.textarea.addEventListener('scroll', () => {
            this.lineNumbers.scrollTop = this.textarea.scrollTop;
        });

        // Basic tab support
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.textarea.selectionStart;
                const end = this.textarea.selectionEnd;
                this.textarea.value = this.textarea.value.substring(0, start) + '  ' + this.textarea.value.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
            }
        });
    }

    updateLineNumbers() {
        const lines = this.textarea.value.split('\n').length;
        this.lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => `<div>${i + 1}</div>`).join('');
    }

    getCode() {
        return this.textarea.value;
    }

    setCode(code) {
        this.textarea.value = code.trim();
        this.updateLineNumbers();
    }
}
