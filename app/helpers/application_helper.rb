module ApplicationHelper
	def latest_tweet
		Twitter::user_timeline("dbwest").first.text
	end
end
