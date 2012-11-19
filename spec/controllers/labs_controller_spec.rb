require 'spec_helper'

describe LabsController do

  describe "GET 'productsearch'" do
    it "returns http success" do
      get 'productsearch'
      response.should be_success
    end
  end

end
