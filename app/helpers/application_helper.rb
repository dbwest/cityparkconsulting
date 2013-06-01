module ApplicationHelper
	def latest_tweet
		Twitter::user_timeline("cityparktweets").first.text
	end
	
end
