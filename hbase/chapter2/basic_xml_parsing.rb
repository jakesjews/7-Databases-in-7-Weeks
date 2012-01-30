import 'javax.xml.stream.XMLStreamConstants'

factory = javax.xml.stream.XMLInputFactory.newInstance
reader  = factory.createXMLStreamReader(java.lang.System.in)

while reader.has_next

    case reader.next
    
        when XMLStreamConstants::START_ELEMENT
            tag = reader.local_name
            # do something with tag

        when XMLStreamConstants::CHARACTERS
            text = reader.text
            # do something with text

        when XMLStreamConstants::END_ELEMENT
            # same as START_ELEMENT
    end
end
