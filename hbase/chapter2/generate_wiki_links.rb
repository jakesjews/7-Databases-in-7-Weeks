import 'org.apache.hadoop.hbase.client.HTable'
import 'org.apache.hadoop.hbase.client.Put'
import 'org.apache.hadoop.hbase.client.Scan'
import 'org.apache.hadoop.hbase.util.Bytes'

def jbytes( *args )
    return args.map { |arg| arg.to_s.to_java_bytes }
end

wiki_table  = HTable.new( @hbase.configuration, 'wiki' )
links_table = HTable.new( @hbase.configuration, 'links' )
links_table.setAutoFlush( false )

scanner = wiki_table.getScanner( Scan.new )

linkpattern = /\[\[([^\[\]\|\:\#][^\[\]\|:]*)(?:\|([^\[\]\|]+))?\]\]/

count = 0

while ( result = scanner.next() )
   
   title = Bytes.toString( result.getRow() )
   text  = Bytes.toString( result.getValue( *jbytes( 'text', '' ) ) )

    if text

        put_to = nil
       
        text.scan(linkpattern) do |target, label|

            unless put_to
                put_to = Put.new( *jbytes( title ) )
                put_to.setWriteToWAL( false )
            end

            target.strip!
            target.capitalize!

            label = '' unless label
            label.strip!

            put_to.add( *jbytes( "to", target, label ) )
           
            put_from = Put.new( *jbytes( target ) )
            put_from.add( *jbytes( "from", title, label ) )
            put_from.setWriteToWAL( false )
            links_table.put( put_from )

        end

        links_table.put( put_to ) if put_to

        links_table.flushCommits()

    end

    count += 1
    puts "#{count} pages processed (#{title})" if count % 500 == 0

end

links_table.flushCommits()

exit    
