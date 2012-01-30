$:.push( './gen-rb' )

require 'thrift'
require 'hbase'

socket    = Thrift::Socket.new( 'localhost', 9090 )
transport = Thrift::BufferedTransport.new( socket )
protocol  = Thrift::BinaryProtocol.new( transport )
client    = Apache::Hadoop::Hbase::Thrift::Hbase::Client.new( protocol )

transport.open()

client.getTableNames().sort.each do |table|
    puts "#{table}"
    client.getColumnDescriptors( table ).each do |col, desc|
        puts "  #{desc.name}"
        puts "      maxVersions: #{desc.maxVersions}"
        puts "      compression: #{desc.compression}"
        puts "      bloomFilterType: #{desc.bloomFilterType}"
    end
end

transport.close()
