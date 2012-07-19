require 'spec_helper'

describe "pages/index.html.erb" do
  it "has the right title" do
    render
    rendered.should contain("City Park Consulting")
  end
  it "displays a javascript slider" do
end

end
