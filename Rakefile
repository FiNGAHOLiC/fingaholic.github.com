desc "Launch preview environment"
task :preview do
	sh "jekyll --server --auto"
end


desc "Pushing repository to Github"
task :push do
	message = "Site updated at #{Time.now.strftime('%Y-%m-%d')}"
	sh "git add ."
	sh "git commit -m \"#{message}\""
	sh "git push origin master"
end

desc "Given a title as an argument, create a new post file"
task :post, [:title] do |t, args|
	filename = "#{Time.now.strftime('%Y-%m-%d')}-#{args.title.gsub(/\s/, '-').downcase}.md"
	path = File.join("_posts", filename)
	if File.exist? path; raise RuntimeError.new("Won't clobber #{path}"); end
	File.open(path, 'w') do |file|
		file.write <<-EOS
---
layout: post
category: 
title: #{args.title}
date: #{Time.now.strftime('%Y-%m-%d')}
summary: 
---
EOS
	end
	puts "Open #{path} in an editor."
end
