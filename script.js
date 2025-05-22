// ... existing code ...
  <script>
    // タスクのデータ構造
    class Task {
      constructor(text, priority = 'normal') {
        this.id = Date.now();
        this.text = text;
        this.priority = priority;
        this.created = new Date();
        this.completed = false;
      }
    }

    // アプリケーションの状態管理
    const state = {
      tasks: [],
      filter: 'all' // 'all', 'active', 'completed'
    };

    // ローカルストレージからデータを読み込む
    function loadTasks() {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        state.tasks = JSON.parse(savedTasks).map(task => {
          return Object.assign(new Task(), task);
        });
      }
    }

    // タスクを保存する
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    }

    // タスクを追加する
    function addTask() {
      const input = document.getElementById('todo-input');
      const value = input.value.trim();
      if (!value) return;

      const task = new Task(value);
      state.tasks.push(task);
      saveTasks();
      render();
      input.value = '';
    }

    // タスクを完了する
    function toggleTask(id) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
      }
    }

    // タスクを削除する
    function deleteTask(id) {
      state.tasks = state.tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }

    // タスクを編集する
    function editTask(id) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        const newText = prompt('タスクを編集:', task.text);
        if (newText && newText.trim()) {
          task.text = newText.trim();
          saveTasks();
          render();
        }
      }
    }

    // 優先度を変更する
    function changePriority(id, priority) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.priority = priority;
        saveTasks();
        render();
      }
    }

    // フィルターを変更する
    function setFilter(filter) {
      state.filter = filter;
      render();
    }

    // タスクを表示する
    function render() {
      const list = document.getElementById('todo-list');
      list.innerHTML = '';

      // フィルタリング
      const filteredTasks = state.tasks.filter(task => {
        if (state.filter === 'active') return !task.completed;
        if (state.filter === 'completed') return task.completed;
        return true;
      });

      // 優先度でソート
      filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      filteredTasks.forEach(task => {
        const el = document.createElement('div');
        el.className = `todo-item ${task.completed ? 'completed' : ''}`;
        el.innerHTML = `
          <div class="task-content">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onclick="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="priority-badge ${task.priority}">${task.priority}</span>
          </div>
          <div class="task-actions">
            <button onclick="editTask(${task.id})">編集</button>
            <select onchange="changePriority(${task.id}, this.value)">
              <option value="high" ${task.priority === 'high' ? 'selected' : ''}>高</option>
              <option value="normal" ${task.priority === 'normal' ? 'selected' : ''}>中</option>
              <option value="low" ${task.priority === 'low' ? 'selected' : ''}>低</option>
            </select>
            <button onclick="deleteTask(${task.id})">削除</button>
          </div>
        `;
        list.appendChild(el);
      });

  Date
}
