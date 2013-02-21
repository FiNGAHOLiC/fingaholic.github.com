# Usage: rake preveiw
desc "Build files and launch preview environment"
task :preview do
	sh "jekyll --server --auto"
end
#
# Usage: rake watch
desc "Grunt watch"
task :watch do
	sh "grunt"
end

# Usage: rake publish
desc "Pushing repository to Github"
task :publish do
	message = "Site updated at #{Time.now.strftime('%Y-%m-%d')}"
	sh "git add ."
	sh "git commit -m \"#{message}\""
	sh "git push origin master"
end

# Usage: rake post["new-post-name"]
desc "Given a title as an argument, create a new post file"
task :post, [:title] do |t, args|
	dirname = File.join(".", "_posts")
	if not FileTest.directory?(dirname)
		abort("rake aborted: #{dirname} directory is not found.")
	end
	date = Time.now.strftime('%Y-%m-%d')
	slug = args.title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
	filename = "#{date}-#{slug}.md"
	fullpath = File.join(dirname, filename)
	if File.exist?(fullpath)
		abort("rake aborted: #{fullpath} already exists.")
	end
	File.open(fullpath, 'w') do |post|
		post.puts "---"
		post.puts "layout: post"
		post.puts "category: "
		post.puts "title: #{args.title}"
		post.puts "date: #{date}"
		post.puts "summary: "
		post.puts "---"
	end
	puts "Open #{fullpath} in an editor."
end
