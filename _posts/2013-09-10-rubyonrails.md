---
layout: post
category: rubyonrails
title: Ruby On Railsでタスク管理アプリを作ってみる
date: 2013-09-10
summary: Ruby On Railsでタスク管理アプリを作るための備忘録。
---

Vagrantで仮想環境の準備も整ったので[ドットインストール][dotinstall]を見ながら早速Ruby On Railsでシンプルなタスク管理アプリを作ってみる。
[dotinstall]: http://dotinstall.com/lessons/basic_rails_v2/24905 '#05 タスク管理アプリを作ってみよう | Ruby on Rails 4入門 - プログラミングならドットインストール'

# 1. まずはVagrantで仮想環境にログイン

Vagrantでの仮想環境の準備が出来ている前提でまずは仮想環境にログイン。

```bash
$ vagrant ssh
```

# 2. アプリケーションを作成

アプリケーションに必要なコントローラ、モデル、ビューをまとめて生成。
なお、必要なbundleを既にインストールしている場合は--skip-bundleオプションを使用しても良い。

```bash
$ rails new taskapp
```

# 3. Gemfileを編集

アプリケーションディレクトリに移動して、therubyracerを有効化するためにGemfileを編集。

```bash
$ cd tasksapp
$ vi Gemfile
```

下記がコメントアウトされているのでアンコメントする。

```ruby
gem 'therubyracer', platforms: :ruby 
```

編集後、改めて<code class="inline">bundle install</code>しておく。

# 4. サーバーを立ち上げてブラウザで確認してみる

```bash
$ rails s
```

3000番ポートなので[192.168.33.10:3000][address]を叩いて確認。
[address]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 5. モデルを作る

モデルの名前（ここではProject）は大文字で始まり、単数形でなければならない。
なお、属性の初期値はstringなのでなくてもよい。

```bash
$ rails g model Project title:string
```

# 6. 作成したモデルをデータベースに反映する

```bash
$ rake db:migrate
```

# 7. テーブルが作成されているかデータベースを確認する

まずはデータベースにアクセス。

```bash
$ rails db
```

SQL文で確認。

```bash
# テーブルを確認
sqlite> .schema

# データの取得
sqlite> select * from projects

# 終了
sqlite> .exit
```

ダミー用に<code class="inline">rails console</code>でモデルを作っておく。

```bash
$ rails console
```

```bash
# モデルを作成
p = Project.new(title: "p1")

# モデルを保存
p.save

# モデルを確認
p

# ちなみに上記を一気に行う場合
Project.create(title: "p2")

# 全てのモデルを確認
Project.all
```

# 8. コントローラーを作る

コントローラー名は対象となるモデルの複数形にする。

```bash
$ rails g controller Projects
```

# 9. ルーティング用のファイルを編集してルーティングを設定

config/routes.rbを編集。

```bash
$ cd config
$ vi routes.rb
```

projectsに関するルーティングを設定。

```ruby
Taskapp::Application.routes.draw do
	resources :projects
end
```

念のためルーティングを確認しておく。

```bash
$ rake routes
```

# 10. プロジェクトの一覧画面を作る

まずはコントローラー。
app/controllers/projects_controller.rbを下記のように編集。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
end
```

次にビューを作る。
app/views/projectsにindex.html.erbを作成して下記のように編集。

```erb
<h1>Projects</h1>
<ul>
	<% @projects.each do |project| %>
	<li><%= project.title %></li>
	<% end %>
</ul>
```

# 11. ブラウザで一覧画面を確認する

```bash
$ rails s
```

[192.168.33.10:3000/projects/][address2]を叩いて確認。
[address2]: http://192.168.33.10:3000/projects/ 'http://192.168.33.10:3000/projects/'

# 12. rootの設定する

http://192.168.33.10:3000/projects/の内容をhttp://192.168.33.10:3000/で表示したいので、config/routes.rbでルーティングの設定をする。

```ruby
Taskapp::Application.routes.draw do
	resources :projects
	root 'projects#index'
end
```

[192.168.33.10:3000][address3]を叩いて確認。
[address3]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 13. 共通テンプレートを編集する

app/views/layouts/application.html.erbが共通テンプレートなので編集してみる。

```erb
<!DOCTYPE html>
<html>
	<head>
		<title>Taskapp</title>
		<%= stylesheet_link_tag    "application", media: "all", "data-turbolinks-track" => true %>
		<%= javascript_include_tag "application", "data-turbolinks-track" => true %>
		<%= csrf_meta_tags %>
	</head>
	<body>

	<!-- srcがapp/assets/images/logo.pngのimgタグを展開 -->
	<%= image_tag "logo.png" %>

	<%= yield %>

	<!-- 指定したパスへのリンクを展開 -->
	<p><%= link_to "Home[/]", "/" %></p>

	<!-- ちなみに変数を使ってもリンクを展開出来る（パスはrails routesで確認出来る） -->
	<p><%= link_to "Home[/projects/]", projects_path %></p>
	</body>

</html>
```

# 14. プロジェクトの詳細画面を作る

一覧画面に表示されるリストをクリックすると詳細画面に移動させたいので、まずはapp/views/projects/index.html.erbを編集。

```erb
<h1>Projects</h1>
<ul>
	<% @projects.each do |project| %>
	<li><%= link_to project.title, project_path(project.id) %></li>
	<% end %>
</ul>
```

app/controllers/projects_controller.rbを下記のように編集。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
	def show
		@project = Project.find(params[:id])
	end
end
```

次にビューを作る。
app/views/projectsにshow.html.erbを作成して下記のように編集。

```erb
<h1><%= @project.title %></h1>
```

[192.168.33.10:3000][address4]を叩いて確認。
[address4]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 15. プロジェクトの新規作成画面を作る

新規作成画面に移動するためのリンクを追加したいのでapp/views/projects/index.html.erbを下記のように編集。

```erb
<h1>Projects</h1>
<ul>
	<% @projects.each do |project| %>
	<li><%= link_to project.title, project_path(project.id) %></li>
	<% end %>
</ul>
<p><%= link_to "Add New", new_project_path %></p>
```

app/controllers/projects_controller.rbを下記のように編集。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
	def show
		@project = Project.find(params[:id])
	end
	def new
		@project = Project.new
	end
end
```

次にビューを作る。
app/views/projectsにnew.html.erbを作成して下記のように編集。

```erb
<h1><%= @project.title %></h1>
```

[192.168.33.10:3000][address5]を叩いて確認。
[address5]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 16. データを保存してみる

app/controllers/projects_controller.rbを下記のように編集。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
	def show
		@project = Project.find(params[:id])
	end
	def new
		@project = Project.new
	end
	def create
		@project = Project.new(project_params)
		@project.save
		redirect_to projects_path
	end
	private
		def project_params
			params[:project].permit(:title)
		end
end
```

ちなみに

> project_paramsをフィルタリングする手法はStrong Parametersと呼ばれ、
> Mass Assignmentという攻撃を防御することができます。

とある。

[192.168.33.10:3000][address6]を叩いて確認。
[address6]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 17. バリデーションを設定する

現状だと空のデータも登録できてしまうので、バリデーションを用いて登録出来ない仕組みを作る。

バリデーションはモデルに記述していくので、app/models/project.rbを下記のように編集。

```ruby
class Project < ActiveRecord::Base
	validates :title, presence: true
end
```

このままだとエラーがあってもそのまま移動してしまうので移動しないようにapp/controllers/projects_controller.rbを編集。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
	def show
		@project = Project.find(params[:id])
	end
	def new
		@project = Project.new
	end
	def create
		@project = Project.new(project_params)
		if @project.save
			redirect_to projects_path
		else
			render 'new'
		end
	end
	private
		def project_params
			params[:project].permit(:title)
		end
end
```

エラーメッセージも出すようにapp/views/projects/new.html.erbを編集。

```erb
<h1>Add New</h1>

<%= form_for @project do |f| %>
	<p><%= f.label :title %>:<%= f.text_field :title %></p>
	<% if @project.errors.any? %>
		<p class="error"><%= @project.errors.messages[:title][0] %><p>
	<% end %>
	<p><%= f.submit %></p>
<% end %>
```

メッセージを変えたい場合はモデル（app/models/project.rb）を下記のように編集。

```ruby
class Project < ActiveRecord::Base
	validates :title, presence: { message: "入力してください" }
end
```

なお、空文字チェック以外にも長さをバリデートしたり複数登録出来る。

```ruby
class Project < ActiveRecord::Base
	validates :title,
	presence: { message: "入力してください" }, # 空の時
	length: { minimum: 3, message: "短すぎます" } # 長さが2文字以下の時
end
```

ってかデフォルトの機能でfield\_with\_errorsなるエラー用のdivが出力されて邪魔なので調べて見たらconfig/application.rb内に下記を追記する事で出力しないように出来た。

```ruby
# Applicationクラス内に記述する事
config.action_view.field_error_proc = Proc.new { |html_tag, instance| %Q(#{html_tag}).html_safe }
```

* [バリデーションエラー時にdiv.field\_with\_errorsを出力しないようにする - t-taira blog](http://t-taira.hatenablog.com/entry/20120222/1329864269 'バリデーションエラー時にdiv.field_with_errorsを出力しないようにする - t-taira blog')

# 18. 編集フォームを作る

まずはトップページに編集ページヘのリンク先を追加するためにapp/views/projectsにindex.html.erbを下記のように編集。

```erb
<h1>Projects</h1>
<ul>
	<% @projects.each do |project| %>
	<li>
		<%= link_to project.title, project_path(project.id) %>
		<%= link_to "[edit]", edit_project_path(project.id) %>
	</li>
	<% end %>
</ul>
<p><%= link_to "Add New", new_project_path %></p>
```

アクションを設定するためにapp/controllers/projects_controller.rbを下記のように編集。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
	def show
		@project = Project.find(params[:id])
	end
	def new
		@project = Project.new
	end
	def create
		@project = Project.new(project_params)
		if @project.save
			redirect_to projects_path
		else
			render 'new'
		end
	end
	def edit
		@project = Project.find(params[:id])
	end
	private
		def project_params
			params[:project].permit(:title)
		end
end
```

app/views/projectsにedit.html.erbを作成して下記のように編集。

```erb
<h1>Edit</h1>

<%= form_for @project do |f| %>
	<p><%= f.label :title %>:<%= f.text_field :title %></p>
	<% if @project.errors.any? %>
		<p><%= @project.errors.messages[:title][0] %></p>
	<% end %>
	<p><%= f.submit %></p>
<% end %>
```

[192.168.33.10:3000][address7]を叩いて確認。
[address7]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 18. データを更新してみる

app/controllers/projects_controller.rbを下記のように編集。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
	def show
		@project = Project.find(params[:id])
	end
	def new
		@project = Project.new
	end
	def create
		@project = Project.new(project_params)
		if @project.save
			redirect_to projects_path
		else
			render 'new'
		end
	end
	def edit
		@project = Project.find(params[:id])
	end
	def update
		@project = Project.find(params[:id])
		if @project.update(project_params)
			redirect_to projects_path
		else
			render 'edit'
		end
	end
	private
		def project_params
			params[:project].permit(:title)
		end
end
```

[192.168.33.10:3000][address8]を叩いて確認。
[address8]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 19. 部品を共通化する

new.htmlとedit.htmlは同じformモジュールを使用しているので、共通化してみる。

まずはapp/views/projects/に_form.html.erbを作成し、form部分の記述のみ抜き出す。

```erb
<%= form_for @project do |f| %>
	<p><%= f.label :title %>:<%= f.text_field :title %></p>
	<% if @project.errors.any? %>
		<p><%= @project.errors.messages[:title][0] %></p>
	<% end %>
	<p><%= f.submit %></p>
<% end %>
```

edit.htmlを下記のように編集。

```erb
<h1>Edit</h1>

<%= render 'form' %>
```

new.htmlも同様に編集。

```erb
<h1>Add New</h1>

<%= render 'form' %>
```

まさにDRY。

# 20. データを削除する

一覧画面に表示されるリストをクリックすると削除画面に移動させたいので、まずはapp/views/projects/index.html.erbを編集。

```erb
<h1>Projects</h1>
<ul>
	<% @projects.each do |project| %>
	<li>
		<%= link_to project.title, project_path(project.id) %>
		<%= link_to "[edit]", edit_project_path(project.id) %>
		<%= link_to "[delete]", project_path(project.id), method: :delete, data: { confirm: "are you sure?" } %>
	</li>
	<% end %>
</ul>
<p><%= link_to "Add New", new_project_path %></p>
```

アクションを設定。

```ruby
class ProjectsController < ApplicationController
	def index
		@projects = Project.all
	end
	def show
		@project = Project.find(params[:id])
	end
	def new
		@project = Project.new
	end
	def create
		@project = Project.new(project_params)
		if @project.save
			redirect_to projects_path
		else
			render 'new'
		end
	end
	def edit
		@project = Project.find(params[:id])
	end
	def update
		@project = Project.find(params[:id])
		if @project.update(project_params)
			redirect_to projects_path
		else
			render 'edit'
		end
	end
	def destroy
		@project = Project.find(params[:id])
		@project.destroy
		redirect_to projects_path
	end
	private
		def project_params
			params[:project].permit(:title)
		end
end
```

[192.168.33.10:3000][address9]を叩いて確認。
[address9]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 21. before_actionを使ってcontrollerのコードをDRYに

共通する処理はbefore\_actionを使うとコードをDRYに出来るのでapp/controllers/projects_controller.rbを下記のように編集。

```ruby
class ProjectsController < ApplicationController
	before_action :set_project, only: [:show, :edit, :update, :destroy]
	def index
		@projects = Project.all
	end
	def show
	end
	def new
		@project = Project.new
	end
	def create
		@project = Project.new(project_params)
		if @project.save
			redirect_to projects_path
		else
			render 'new'
		end
	end
	def edit
	end
	def update
		if @project.update(project_params)
			redirect_to projects_path
		else
			render 'edit'
		end
	end
	def destroy
		@project.destroy
		redirect_to projects_path
	end
	private
		def project_params
			params[:project].permit(:title)
		end
		def set_project
			@project = Project.find(params[:id])
		end
end
```

[192.168.33.10:3000][address10]を叩いて確認。
[address10]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 22. Tasksの設定をする

Projectsに紐付いた形でTasksの設定をする。

まずはモデルを作成。

```bash
$ rails g model Task title done:boolean project:references
```

モデルの初期値を設定するためにdb/migrate/以下の**************_create_tasks.rbに初期値を追加。

```ruby
class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :title
      t.boolean :done, default: false
      t.references :project, index: true

      t.timestamps
    end
  end
end
```

作成したモデルをデータベースに反映する。

```bash
$ rake db:migrate
```

コントローラーを作成。

```bash
$ rails g controller Tasks
```

モデルの関連付けを反映するためにapp/models/projects.rbを下記のように編集。

```ruby
class Project < ActiveRecord::Base
	has_many :tasks
	validates :title,
	presence: { message: "入力してください" },
	length: { minimum: 3, message: "短すぎます" }
end
```

ルーティングを設定するためにconfig/routes.rbを下記のように編集。

```ruby
Taskapp::Application.routes.draw do
	resources :projects do
		resources :tasks, only: [:create, :destroy]
	end
	root 'projects#index'
end
```

# 23. Tasksの新規作成フォームを作る

show.htmlにタスクの一覧を表示したいのでapp/views/projects/show.html.erbを下記のように編集。

```erb
<h1><%= @project.title %></h1>

<ul>
	<% @project.tasks.each do |task| %>
		<li><%= task.title %></li>
	<% end %>
	<li>
		<%= form_for [@project, @project.tasks.build] do |f| %>
			<%= f.text_field :title %>
			<%= f.submit %>
		<% end %>
	</li>
</ul>
```

# 24. Tasksを保存する

app/controllers/tasks_controller.rbを下記のように編集。

```ruby
class TasksController < ApplicationController
	def create
		@project = Project.find(params[:project_id])
		@task = @project.tasks.create(task_params)
		redirect_to project_path(@project.id)
	end
	private
		def task_params
			params[:task].permit(:title)
		end
end
```

バリデーションも適用したいのでapp/models/task.rbを下記のように編集。

```ruby
class Task < ActiveRecord::Base
	belongs_to :project
	validates :title, presence: true
end
```

[192.168.33.10:3000][address11]を叩いて確認。
[address11]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 25. Tasksを削除する

一覧画面に表示されるリストをクリックすると削除画面に移動させたいので、まずはapp/views/projects/show.html.erbを編集。

```erb
<h1><%= @project.title %></h1>

<ul>
        <% @project.tasks.each do |task| %>
        <li>
                <%= task.title %>
                <%= link_to "[delete]", project_task_path(task.project_id, task.id), method: :delete, data: { confirm: "are you sure?" } %>
        </li>
        <% end %>
        <li>
                <%= form_for [@project, @project.tasks.build] do |f| %>
                        <%= f.text_field :title %>
                        <%= f.submit %>
                <% end %>
        </li>
</ul>
```

アクションを設定するためにapp/controllers/tasks_controller.rbを下記のように編集。

```ruby
class TasksController < ApplicationController
	def create
		@project = Project.find(params[:project_id])
		@task = @project.tasks.create(task_params)
		redirect_to project_path(@project.id)
	end
	def destroy
		@task = Task.find(params[:id])
		@task.destroy
		redirect_to project_path(params[:project_id])
	end
	private
		def task_params
			params[:task].permit(:title)
		end
end
```

[192.168.33.10:3000][address12]を叩いて確認。
[address12]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 26. check\_box\_tagを使ってチェックボックスを表示する

進捗管理用のチェックボックスタグを付けたいのでapp/views/projects/show.html.erbを編集。

```erb
<h1><%= @project.title %></h1>

<ul>
        <% @project.tasks.each do |task| %>
        <li>
                <%= check_box_tag '', '', task.done, {'data-id' => task.id, 'data-project_id' => task.project_id} %>
                <%= task.title %>
                <%= link_to "[delete]", project_task_path(task.project_id, task.id), method: :delete, data: { confirm: "are you sure?" } %>
        </li>
        <% end %>
        <li>
                <%= form_for [@project, @project.tasks.build] do |f| %>
                        <%= f.text_field :title %>
                        <%= f.submit %>
                <% end %>
        </li>
</ul>
```

Ajaxで該当するタスクの切り替えを行いたいので引き続きapp/views/projects/show.html.erbを編集。

```erb
<h1><%= @project.title %></h1>

<ul>
        <% @project.tasks.each do |task| %>
        <li>
                <%= check_box_tag '', '', task.done, {'data-id' => task.id, 'data-project_id' => task.project_id} %>
                <%= task.title %>
                <%= link_to "[delete]", project_task_path(task.project_id, task.id), method: :delete, data: { confirm: "are you sure?" } %>
        </li>
        <% end %>
        <li>
                <%= form_for [@project, @project.tasks.build] do |f| %>
                        <%= f.text_field :title %>
                        <%= f.submit %>
                <% end %>
        </li>
</ul>

<script>
        $(function(){
                $('input[type=checkbox]').click(function(){
                        var idProject = $(this).data('project_id'),
                            idTask = $(this).data('id');
                        $.post('/projects/' + idProject + '/tasks/' + idTask + '/toggle');
                });
        });
</script>
```

ルーティングを設定するためにconfig/routes.rbを下記のように編集。

```ruby
Taskapp::Application.routes.draw do
	resources :projects do
		resources :tasks, only: [:create, :destroy]
	end
	post '/projects/:project_id/tasks/:id/toggle' => 'tasks#toggle'
	root 'projects#index'
end
```

アクションを設定するためにapp/controllers/tasks_controller.rbを編集。
なお、画面切り替えはしないので<code class="inline">render nothing: true</code>も入れておく。

```ruby
class TasksController < ApplicationController
        def create
                @project = Project.find(params[:project_id])
                @task = @project.tasks.create(task_params)
                redirect_to project_path(@project.id)
        end
        def destroy
                @task = Task.find(params[:id])
                @task.destroy
                redirect_to project_path(params[:project_id])
        end
	def toggle
		render nothing: true
		@task = Task.find(params[:id])
		@task.done = !@task.done
		@task.save
	end
        private
                def task_params
                        params[:task].permit(:title)
                end
end
```

[192.168.33.10:3000][address13]を叩いて確認。
[address13]: http://192.168.33.10:3000 'http://192.168.33.10:3000'

# 27. Tasksの数を表示する

プロジェクト一覧にタスクの数を表示させたいので、app/views/projects/index.html.erbを編集。

```erb
<h1>Projects</h1>
<ul>
        <% @projects.each do |project| %>
        <li>
                <%= link_to project.title, project_path(project.id) %>（<%= project.tasks.count %>）
                <%= link_to "[edit]", edit_project_path(project.id) %>
                <%= link_to "[delete]", project_path(project.id), method: :delete, data: { confirm: "are you sure?" } %>
        </li>
        <% end %>
</ul>
<p><%= link_to "Add New", new_project_path %></p>
```

完了していない残りのタスクを表示させるためにapp/models/task.rbを編集。

```ruby
class Task < ActiveRecord::Base
        belongs_to :project
        validates :title, presence: true
        scope :unfinished, -> { where(done: false) }
end
```

再度app/views/projects/index.html.erbを編集。

```erb
<h1>Projects</h1>
<ul>
        <% @projects.each do |project| %>
        <li>
                <%= link_to project.title, project_path(project.id) %>（<%= project.tasks.unfinished.count %>/<%= project.tasks.count %>）
                <%= link_to "[edit]", edit_project_path(project.id) %>
                <%= link_to "[delete]", project_path(project.id), method: :delete, data: { confirm: "are you sure?" } %>
        </li>
        <% end %>
</ul>
<p><%= link_to "Add New", new_project_path %></p>
```

[192.168.33.10:3000][address14]を叩いて確認。
[address14]: http://192.168.33.10:3000 'http://192.168.33.10:3000'
