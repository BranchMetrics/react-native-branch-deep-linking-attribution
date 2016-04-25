Pod::Spec.new do |s|
  s.name             = "react-native-branch"
  s.version          = "0.0.1"
  s.summary          = "iOS react-native branch"
  s.requires_arc = true
  s.author       = { 'rt2zz' => 'zack@root-two.com' }
  s.license      = 'MIT'
  s.homepage     = 'n/a'
  s.platform     = :ios, "7.0"
  s.dependency 'Branch'
end

#  s.source       = { :git => "https://github.com/branchmetrics/react-native-branch.git" }
#  s.source_files = 'iOS/*'
