require 'json'

# expect package.json in current dir
package_json_filename = File.expand_path("./package.json", __dir__)

# load the spec from package.json
spec = JSON.load(File.read(package_json_filename))

Pod::Spec.new do |s|
  s.name             = spec['name']
  s.version          = spec['version']
  s.summary          = spec['description']
  s.requires_arc = true
  s.authors      = {
                     'rt2zz' => 'zack@root-two.com',
                     'Jimmy Dee' => 'jgvdthree@gmail.com'
                   }
  s.license      = spec['license']
  s.homepage     = spec['homepage']
  s.platform     = :ios, "7.0"
  s.source       = { spec['repository']['type'].to_sym => spec['repository']['url'].sub(/^[a-z]+\+/, '') }
  s.source_files = [ "ios/*.h", "ios/*.m"]
  s.dependency 'Branch', '0.27.0'
  s.dependency 'React' # to ensure the correct build order
end
