desc "Launch preview environment"
task :preview do
	sh "jekyll --server --auto"
end


desc "Pushing repository to Github"
task :push do
	message = "Site updated at #{Time.now.utc}"
	sh "git add ."
	sh "git commit -m \"#{message}\""
	sh "git push origin master"
end

