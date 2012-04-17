desc "Launch preview environment"
task :preview do
	system "jekyll --server --auto"
end

desc "Given a title as an argument, create a new post file"
task :write, [:title, :category] do |t, args|
	filename = "#{Time.now.strftime('%Y-%m-%d')}-#{args.title.gsub(/\s/, '-').downcase}.md"
	path = File.join("_posts", filename)
	if File.exist? path; raise RuntimeError.new("Won't clobber #{path}"); end
	File.open(path, 'w') do |file|
		file.write <<-EOS
---
layout: post
category: #{args.category}
title: #{args.title}
date: #{Time.now.strftime('%Y-%m-%d')}
summary: ""
---
EOS
	end
	puts "Now open #{path} in an editor."
end

