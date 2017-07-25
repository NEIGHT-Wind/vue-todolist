var setLocal = {
	save (key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	get (key) {
		return JSON.parse(localStorage.getItem(key));
	}
}
var list = setLocal.get('todo') || [];
var filterChecked = {
	all : function (list) {
		return list;
	},
	finish : function (list) {
		return list.filter(function (item) {
			return item.checked;
		})
	},
	unfinish : function (list) {
		return list.filter(function (item) {
			return !item.checked;
		})
	}
}
var vue = new Vue({
	el : '.main',
	watch : {
		list : {
			deep : true,
			handler : function () {
				setLocal.save('todo', this.list);
			}
		}
	},
	data : {
		list : list,
		inputValue : '',
		editingTodo : '',
		beforeEditing : '',
		visibility : 'all'
	},
	computed : {
		filterList () {
			var len = this.list.filter(function(item){
				return !item.checked;
			}).length;
			return len;
		},
		filterCheck () {
			return filterChecked[this.visibility] ? filterChecked[this.visibility](this.list) : this.list;
		}
	},
	methods : {
		addTodo () {
			this.list.push({
				title : this.inputValue,
				checked : false
			})
			this.inputValue = '';
		},
		deleteTodo(it) {
			var index = this.list.indexOf(it);
			this.list.splice(index, 1);
		},
		editTodo (it) {
			this.editingTodo = it;
			this.beforeEditing = it.title;
		},
		editedTodo () {
			this.editingTodo = ''
		},
		cancelEdit (it) {
			it.title = this.beforeEditing;
			this.beforeEditing = '';
			this.editingTodo = '';
		}
	},
	directives : {
		focus : {
			update (el,binding){
				if (binding.value) {
					el.focus()
				}
			}
		}
	}
})
function hashChange() {
	var hash = window.location.hash.slice(1);
	vue.visibility = hash;
}
hashChange();
window.addEventListener('hashchange', hashChange);
