import 'org.apache.hadoop.hbase.client.HTable'
import 'org.apache.hadoop.hbase.client.Put'

def jbytes( *args )
    args.map { |arg| arg.to_s.to_java_bytes }
end

def put_many( table_name, row, column_values )

    table = HTable.new( @hbase.configuration, table_name )
    
    p = Put.new( *jbytes( row ) )

    column_values.map { |k, v|  
        
        col = k.split(":").first
        col_family = k.split(":")[1].to_s
        
        p.add( *jbytes( col, col_family, v ) )

    } 

    table.put( p )
end
