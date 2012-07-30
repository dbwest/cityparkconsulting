class TexterController < ApplicationController

  def index

  end

  def sendtext
    number_to_send_to = "3035476117"

    twilio_sid = "ACa10d4fb2e6914a81abd92436b110ea7d"
    twilio_token = "0e667cce35609bec5145d02c60f979a6"
    twilio_phone_number = "3038168276"

    @twilio_client = Twilio::REST::Client.new twilio_sid, twilio_token

    @twilio_client.account.sms.messages.create(
      :from => "+1#{twilio_phone_number}",
      :to => number_to_send_to,
      :body => params[:mytext]
    )

    redirect_to landing_url
  end


end