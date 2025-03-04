document.addEventListener('DOMContentLoaded', function() {
    // アイデアジェネレーター
    initIdeaGenerator();
    
    // ビジュアルエディター（キャンバス）
    initCanvas();
    
    // テキストメモ
    initTextEditor();
    
    // ムードボード
    initMoodBoard();
});

// アイデアジェネレーター機能
function initIdeaGenerator() {
    const generateBtn = document.getElementById('generate-idea');
    const concept1 = document.getElementById('concept1');
    const concept2 = document.getElementById('concept2');
    const concept3 = document.getElementById('concept3');
    
    // コンセプトの種類
    const concepts = {
        objects: ['スマートフォン', '本', '車', '植物', '楽器', 'ロボット', '時計', '家具', 'おもちゃ', '料理'],
        actions: ['共有する', '変換する', '学ぶ', '創造する', '接続する', '分析する', '表現する', '予測する', '協力する', '探索する'],
        contexts: ['教育', '芸術', '健康', '環境', '仕事', '娯楽', '社会', '科学', '技術', '日常生活'],
        emotions: ['喜び', '驚き', '好奇心', '平和', '活力', '共感', '感謝', '希望', '興奮', '安心'],
        technologies: ['AI', 'AR/VR', 'ブロックチェーン', 'IoT', '3Dプリンティング', 'ロボティクス', 'バイオテクノロジー', 'クラウド', '音声認識', 'ウェアラブル']
    };
    
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    function generateNewIdea() {
        // ランダムなカテゴリーを選択
        const categories = Object.keys(concepts);
        const randomCategories = [];
        
        // 重複なく3つのカテゴリーを選択
        while (randomCategories.length < 3) {
            const category = getRandomElement(categories);
            if (!randomCategories.includes(category)) {
                randomCategories.push(category);
            }
        }
        
        // 各カテゴリーからランダムな要素を選択
        concept1.textContent = getRandomElement(concepts[randomCategories[0]]);
        concept2.textContent = getRandomElement(concepts[randomCategories[1]]);
        concept3.textContent = getRandomElement(concepts[randomCategories[2]]);
        
        // アニメーション効果
        [concept1, concept2, concept3].forEach(concept => {
            concept.classList.add('concept-animate');
            setTimeout(() => {
                concept.classList.remove('concept-animate');
            }, 500);
        });
    }
    
    generateBtn.addEventListener('click', generateNewIdea);
    
    // 初期アイデアを生成
    generateNewIdea();
}

// ビジュアルエディター（キャンバス）機能
function initCanvas() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('color-select');
    const brushSize = document.getElementById('brush-size');
    const clearBtn = document.getElementById('clear-canvas');
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // キャンバスの幅と高さをレスポンシブに設定
    function resizeCanvas() {
        const container = canvas.parentElement;
        const width = container.clientWidth;
        // アスペクト比を維持
        canvas.width = Math.min(600, width);
        canvas.height = Math.min(400, width * 0.66);
        
        // キャンバスをクリア
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const [currentX, currentY] = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        [lastX, lastY] = [currentX, currentY];
    }
    
    // タッチとマウスの座標を取得する関数
    function getCoordinates(e) {
        let x, y;
        
        if (e.type.includes('touch')) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            const rect = canvas.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        return [x, y];
    }
    
    // マウスイベント
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // タッチイベント（モバイル用）
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    // クリアボタン
    clearBtn.addEventListener('click', function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
}

// テキストメモ機能
function initTextEditor() {
    const textArea = document.getElementById('idea-notes');
    const saveBtn = document.getElementById('save-notes');
    const loadBtn = document.getElementById('load-notes');
    const clearBtn = document.getElementById('clear-notes');
    
    // ローカルストレージのキー
    const STORAGE_KEY = 'creative-tool-notes';
    
    // 保存ボタン
    saveBtn.addEventListener('click', function() {
        const notes = textArea.value;
        localStorage.setItem(STORAGE_KEY, notes);
        alert('メモが保存されました');
    });
    
    // 読み込みボタン
    loadBtn.addEventListener('click', function() {
        const notes = localStorage.getItem(STORAGE_KEY);
        if (notes) {
            textArea.value = notes;
        } else {
            alert('保存されたメモはありません');
        }
    });
    
    // クリアボタン
    clearBtn.addEventListener('click', function() {
        textArea.value = '';
    });
    
    // 前回のメモがあれば読み込む
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
        textArea.value = savedNotes;
    }
}

// ムードボード機能
function initMoodBoard() {
    const moodButtons = document.querySelectorAll('.mood');
    const moodDisplay = document.getElementById('mood-display');
    
    // ムードごとの設定
    const moodSettings = {
        energetic: {
            background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
            pattern: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px)',
            text: '活発で力強いエネルギーを感じるデザイン。大胆で力強い表現に向いています。'
        },
        calm: {
            background: 'linear-gradient(to right, #2193b0, #6dd5ed)',
            pattern: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            text: '穏やかで落ち着いた雰囲気。調和とバランスを重視したデザインに。'
        },
        mysterious: {
            background: 'linear-gradient(to right, #434343, #000000)',
            pattern: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)',
            text: '神秘的で深遠な印象を与えます。未知の世界や複雑な概念の表現に。'
        },
        futuristic: {
            background: 'linear-gradient(to right, #4facfe, #00f2fe)',
            pattern: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
            text: '未来的でハイテクな印象。革新的なアイデアや最先端の概念表現に。'
        },
        nostalgic: {
            background: 'linear-gradient(to right, #f6d365, #fda085)',
            pattern: 'repeating-radial-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1) 5px, transparent 5px, transparent 10px)',
            text: '懐かしさと温かみを感じるデザイン。思い出や伝統を大切にしたコンセプトに。'
        }
    };
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            const settings = moodSettings[mood];
            
            if (settings) {
                moodDisplay.style.background = settings.background;
                moodDisplay.style.backgroundSize = '20px 20px';
                moodDisplay.style.backgroundImage = settings.pattern;
                moodDisplay.innerHTML = `<p>${settings.text}</p>`;
                
                // ボタン選択状態の視覚的フィードバック
                moodButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
}

// CSSに追加するスタイル（JSで追加）
const style = document.createElement('style');
style.textContent = `
    .concept-animate {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .mood.selected {
        outline: 3px solid #fff;
        box-shadow: 0 0 0 3px var(--primary-color);
    }
`;
document.head.appendChild(style);
