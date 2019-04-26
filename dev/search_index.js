var documenterSearchIndex = {"docs":
[{"location":"#Tutorial-1","page":"Tutorial","title":"Tutorial","text":"","category":"section"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"I'm going to use the flights data from the dplyr tutorial. This data is in the test folder of this package; I created it with the following R code:","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"library(nycflights13)\nsetwd(\"C:/Users/hp/.julia/dev/LightQuery/test\")\nwrite.csv(airports, \"airports.csv\", na = \"\", row.names = FALSE)\nwrite.csv(flights, \"flights.csv\", na = \"\", row.names = FALSE)","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Let's import the tools we need. I'm pulling in from tools from Dates, TimeZones, and Unitful.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> using LightQuery\n\njulia> using Dates: DateTime, Day\n\njulia> import Dates: Minute\n\njulia> Minute(::Missing) = missing;\n\njulia> using Unitful: mi, °, ft\n\njulia> using TimeZones: ZonedDateTime, Class\n\njulia> import TimeZones: TimeZone\n\njulia> TimeZone(::Missing, ::Class) = missing;","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"I re-export CSV for input-output. See the documentation there for information about CSV.File.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airports_file = CSV.File(\"airports.csv\",\n            allowmissing = :auto,\n            missingstrings = [\"\", \"\\\\N\"]\n        )\nCSV.File(\"airports.csv\", rows=1458):\nTables.Schema:\n :faa    String\n :name   String\n :lat    Float64\n :lon    Float64\n :alt    Int64\n :tz     Int64\n :dst    String\n :tzone  Union{Missing, String}","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Let's take a look at the first row. Use named_tuple to coerce a CSV.Row to a NamedTuple.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airport =\n        airports_file |>\n        first |>\n        named_tuple\n(faa = \"04G\", name = \"Lansdowne Airport\", lat = 41.1304722, lon = -80.6195833, alt = 1044, tz = -5, dst = \"A\", tzone = \"America/New_York\")","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"As a start, I want to rename so that I understand what the columns mean. When you rename, names need to be wrapped with Name. Here, I use the chaining macro @> to chain several calls together.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airport =\n        @> airport |>\n        rename(_,\n            airport_code = Name(:faa),\n            latitude = Name(:lat),\n            longitude = Name(:lon),\n            altitude = Name(:alt),\n            time_zone_offset = Name(:tz),\n            daylight_savings = Name(:dst),\n            time_zone = Name(:tzone)\n        )\n(name = \"Lansdowne Airport\", airport_code = \"04G\", latitude = 41.1304722, longitude = -80.6195833, altitude = 1044, time_zone_offset = -5, daylight_savings = \"A\", time_zone = \"America/New_York\")","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Let's create a proper TimeZone. Note the data contains some LEGACY timezones.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airport =\n        @> airport |>\n        transform(_,\n            time_zone = TimeZone(_.time_zone, Class(:STANDARD) | Class(:LEGACY))\n        )\n(name = \"Lansdowne Airport\", airport_code = \"04G\", latitude = 41.1304722, longitude = -80.6195833, altitude = 1044, time_zone_offset = -5, daylight_savings = \"A\", time_zone = tz\"America/New_York\")","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Now that we have a true timezone, we can remove all data that is contingent on timezone.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airport =\n        @> airport |>\n        remove(_,\n            Name(:time_zone_offset),\n            Name(:daylight_savings)\n        )\n(name = \"Lansdowne Airport\", airport_code = \"04G\", latitude = 41.1304722, longitude = -80.6195833, altitude = 1044, time_zone = tz\"America/New_York\")","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Let's also add proper units to our variables.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airport =\n        @> airport |>\n        transform(_,\n            latitude = _.latitude * °,\n            longitude = _.longitude * °,\n            altitude = _.altitude * ft\n        )\n(name = \"Lansdowne Airport\", airport_code = \"04G\", time_zone = tz\"America/New_York\", latitude = 41.1304722°, longitude = -80.6195833°, altitude = 1044 ft)","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Let's put it all together.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> function process_airport(airport)\n            @> airport |>\n            named_tuple |>\n            rename(_,\n                airport_code = Name(:faa),\n                latitude = Name(:lat),\n                longitude = Name(:lon),\n                altitude = Name(:alt),\n                time_zone_offset = Name(:tz),\n                daylight_savings = Name(:dst),\n                time_zone = Name(:tzone)\n            ) |>\n            transform(_,\n                time_zone = TimeZone(_.time_zone, Class(:STANDARD) | Class(:LEGACY)),\n                latitude = _.latitude * °,\n                longitude = _.longitude * °,\n                altitude = _.altitude * ft\n            ) |>\n            remove(_,\n                Name(:time_zone_offset),\n                Name(:daylight_savings)\n            )\n        end;","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"I use over to lazily map.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airports =\n        @> airports_file |>\n        over(_, process_airport);","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"When it comes time to collect, I'm calling make_columns then rows. It makes sense to store this data column-wise. This is because there are multiple columns that might contain missing data.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> airports =\n        airports |>\n        make_columns |>\n        rows;","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"We can use Peek to get a look at the data.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> Peek(airports)\nShowing 4 of 1458 rows\n|                          name | airport_code |                      time_zone |    latitude |    longitude | altitude |\n| -----------------------------:| ------------:| ------------------------------:| -----------:| ------------:| --------:|\n|             Lansdowne Airport |          04G | America/New_York (UTC-5/UTC-4) | 41.1304722° | -80.6195833° |  1044 ft |\n| Moton Field Municipal Airport |          06A |  America/Chicago (UTC-6/UTC-5) | 32.4605722° | -85.6800278° |   264 ft |\n|           Schaumburg Regional |          06C |  America/Chicago (UTC-6/UTC-5) | 41.9893408° | -88.1012428° |   801 ft |\n|               Randall Airport |          06N | America/New_York (UTC-5/UTC-4) |  41.431912° | -74.3915611° |   523 ft |","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"I'll also make sure the airports are indexed by their code so we can access them quickly.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> const indexed_airports =\n        @> airports |>\n        indexed(_, Name(:airport_code));\n\njulia> indexed_airports[\"JFK\"]\n(name = \"John F Kennedy Intl\", airport_code = \"JFK\", time_zone = tz\"America/New_York\", latitude = 40.639751°, longitude = -73.778925°, altitude = 13 ft)","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"That was just the warm-up. Now let's get started working on the flights data.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> flights_file = CSV.File(\"flights.csv\", allowmissing = :auto)\nCSV.File(\"flights.csv\", rows=336776):\nTables.Schema:\n :year            Int64\n :month           Int64\n :day             Int64\n :dep_time        Union{Missing, Int64}\n :sched_dep_time  Int64\n :dep_delay       Union{Missing, Int64}\n :arr_time        Union{Missing, Int64}\n :sched_arr_time  Int64\n :arr_delay       Union{Missing, Int64}\n :carrier         String\n :flight          Int64\n :tailnum         Union{Missing, String}\n :origin          String\n :dest            String\n :air_time        Union{Missing, Int64}\n :distance        Int64\n :hour            Int64\n :minute          Int64\n :time_hour       String\n\njulia> flight =\n        @> flights_file |>\n        first |>\n        named_tuple |>\n        rename(_,\n            departure_time = Name(:dep_time),\n            scheduled_departure_time = Name(:sched_dep_time),\n            departure_delay = Name(:dep_delay),\n            arrival_time = Name(:arr_time),\n            scheduled_arrival_time = Name(:sched_arr_time),\n            arrival_delay = Name(:arr_delay),\n            tail_number = Name(:tailnum),\n            destination = Name(:dest)\n        )\n(year = 2013, month = 1, day = 1, carrier = \"UA\", flight = 1545, origin = \"EWR\", air_time = 227, distance = 1400, hour = 5, minute = 15, time_hour = \"2013-01-01 05:00:00\", departure_time = 517, scheduled_departure_time = 515, departure_delay = 2, arrival_time = 830, scheduled_arrival_time = 819, arrival_delay = 11, tail_number = \"N14228\", destination = \"IAH\")","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"We can use our airports data to make datetimes with timezones.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> scheduled_departure_time = ZonedDateTime(\n            DateTime(flight.year, flight.month, flight.day, flight.hour, flight.minute),\n            indexed_airports[flight.origin].time_zone\n        )\n2013-01-01T05:15:00-05:00","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Note the scheduled arrival time is 818. This means 8:18. We can use divrem(_, 100) to split it up. Not all destinations are not in the flights dataset. If it was an overnight flight, add a day to the arrival time.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> scheduled_arrival_time =\n            if haskey(indexed_airports, flight.destination)\n                possible_arrival_time =\n                    ZonedDateTime(\n                        DateTime(flight.year, flight.month, flight.day, divrem(flight.scheduled_arrival_time, 100)...),\n                        indexed_airports[flight.destination].time_zone\n                    )\n                if possible_arrival_time < scheduled_departure_time\n                    possible_arrival_time + Day(1)\n                else\n                    possible_arrival_time\n                end\n            else\n                missing\n            end\n2013-01-01T08:19:00-06:00","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Let's put it all together.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> function process_flight(row)\n            flight =\n                @> row |>\n                named_tuple |>\n                rename(_,\n                    departure_time = Name(:dep_time),\n                    scheduled_departure_time = Name(:sched_dep_time),\n                    departure_delay = Name(:dep_delay),\n                    arrival_time = Name(:arr_time),\n                    scheduled_arrival_time = Name(:sched_arr_time),\n                    arrival_delay = Name(:arr_delay),\n                    tail_number = Name(:tailnum),\n                    destination = Name(:dest)\n                )\n            scheduled_departure_time = ZonedDateTime(\n                DateTime(flight.year, flight.month, flight.day, flight.hour, flight.minute),\n                indexed_airports[flight.origin].time_zone\n            )\n            scheduled_arrival_time =\n                if haskey(indexed_airports, flight.destination)\n                    possible_arrival_time =\n                        ZonedDateTime(\n                            DateTime(flight.year, flight.month, flight.day, divrem(flight.scheduled_arrival_time, 100)...),\n                            indexed_airports[flight.destination].time_zone\n                        )\n                    if possible_arrival_time < scheduled_departure_time\n                        possible_arrival_time + Day(1)\n                    else\n                        possible_arrival_time\n                    end\n                else\n                    missing\n                end\n            @> flight |>\n                transform(_,\n                    scheduled_departure_time = scheduled_departure_time,\n                    scheduled_arrival_time = scheduled_arrival_time,\n                    air_time = Minute(_.air_time),\n                    distance = _.distance * mi,\n                    departure_delay = Minute(_.departure_delay),\n                    arrival_delay = Minute(_.arrival_delay)\n                ) |>\n                remove(_, Name(:year), Name(:month), Name(:day), Name(:hour),\n                    Name(:minute), Name(:time_hour), Name(:departure_time),\n                    Name(:arrival_time)\n                )\n        end;\n\njulia> flights =\n        @> flights_file |>\n        over(_, process_flight) |>\n        make_columns |>\n        rows;\n\njulia> Peek(flights)\nShowing 4 of 336776 rows\n| carrier | flight | origin | tail_number | destination |  scheduled_departure_time |    scheduled_arrival_time |    air_time | distance | departure_delay | arrival_delay |\n| -------:| ------:| ------:| -----------:| -----------:| -------------------------:| -------------------------:| -----------:| --------:| ---------------:| -------------:|\n|      UA |   1545 |    EWR |      N14228 |         IAH | 2013-01-01T05:15:00-05:00 | 2013-01-01T08:19:00-06:00 | 227 minutes |  1400 mi |       2 minutes |    11 minutes |\n|      UA |   1714 |    LGA |      N24211 |         IAH | 2013-01-01T05:29:00-05:00 | 2013-01-01T08:30:00-06:00 | 227 minutes |  1416 mi |       4 minutes |    20 minutes |\n|      AA |   1141 |    JFK |      N619AA |         MIA | 2013-01-01T05:40:00-05:00 | 2013-01-01T08:50:00-05:00 | 160 minutes |  1089 mi |       2 minutes |    33 minutes |\n|      B6 |    725 |    JFK |      N804JB |         BQN | 2013-01-01T05:45:00-05:00 |                   missing | 183 minutes |  1576 mi |       -1 minute |   -18 minutes |","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Theoretically, the distances between two airports is always the same. Let's make sure this is also the case in our data. First, order by origin, destination, and distance. Then Group By the same variables.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> paths_grouped =\n        @> flights |>\n        order(_, Names(:origin, :destination, :distance)) |>\n        Group(By(_, Names(:origin, :destination, :distance)));","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Each Group will contain a key and value","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> path = first(paths_grouped);\n\njulia> key(path)\n(origin = \"EWR\", destination = \"ALB\", distance = 143 mi)\n\njulia> value(path) |> Peek\nShowing 4 of 439 rows\n| carrier | flight | origin | tail_number | destination |  scheduled_departure_time |    scheduled_arrival_time |   air_time | distance | departure_delay | arrival_delay |\n| -------:| ------:| ------:| -----------:| -----------:| -------------------------:| -------------------------:| ----------:| --------:| ---------------:| -------------:|\n|      EV |   4112 |    EWR |      N13538 |         ALB | 2013-01-01T13:17:00-05:00 | 2013-01-01T14:23:00-05:00 | 33 minutes |   143 mi |      -2 minutes |   -10 minutes |\n|      EV |   3260 |    EWR |      N19554 |         ALB | 2013-01-01T16:21:00-05:00 | 2013-01-01T17:24:00-05:00 | 36 minutes |   143 mi |      34 minutes |    40 minutes |\n|      EV |   4170 |    EWR |      N12540 |         ALB | 2013-01-01T20:04:00-05:00 | 2013-01-01T21:12:00-05:00 | 31 minutes |   143 mi |      52 minutes |    44 minutes |\n|      EV |   4316 |    EWR |      N14153 |         ALB | 2013-01-02T13:27:00-05:00 | 2013-01-02T14:33:00-05:00 | 33 minutes |   143 mi |       5 minutes |   -14 minutes |","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"At this point, we don't need any of the value data. All we need is the key.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> paths =\n        @> paths_grouped |>\n        over(_, key) |>\n        make_columns |>\n        rows;\n\njulia> Peek(paths)\nShowing 4 of 226 rows\n| origin | destination | distance |\n| ------:| -----------:| --------:|\n|    EWR |         ALB |   143 mi |\n|    EWR |         ANC |  3370 mi |\n|    EWR |         ATL |   746 mi |\n|    EWR |         AUS |  1504 mi |","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Notice the data is already sorted by origin and destination, so that for our second Group, we don't need to order first.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> distinct_distances =\n        @> paths |>\n        Group(By(_, Names(:origin, :destination))) |>\n        over(_, @_ transform(key(_),\n            number = length(value(_))\n        ));\n\njulia> Peek(distinct_distances)\nShowing at most 4 rows\n| origin | destination | number |\n| ------:| -----------:| ------:|\n|    EWR |         ALB |      1 |\n|    EWR |         ANC |      1 |\n|    EWR |         ATL |      1 |\n|    EWR |         AUS |      1 |","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Let's see when there are multiple distances for the same path:","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> @> distinct_distances |>\n        when(_, @_ _.number != 1) |>\n        Peek\nShowing at most 4 rows\n| origin | destination | number |\n| ------:| -----------:| ------:|\n|    EWR |         EGE |      2 |\n|    JFK |         EGE |      2 |","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"That's strange. What's up with the EGE airport? Let's take a Peek.","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"julia> @> flights |>\n        when(_, @_ _.destination == \"EGE\") |>\n        Peek\nShowing at most 4 rows\n| carrier | flight | origin | tail_number | destination |  scheduled_departure_time |    scheduled_arrival_time |    air_time | distance | departure_delay | arrival_delay |\n| -------:| ------:| ------:| -----------:| -----------:| -------------------------:| -------------------------:| -----------:| --------:| ---------------:| -------------:|\n|      UA |   1597 |    EWR |      N27733 |         EGE | 2013-01-01T09:28:00-05:00 | 2013-01-01T12:20:00-07:00 | 287 minutes |  1726 mi |      -2 minutes |    13 minutes |\n|      AA |    575 |    JFK |      N5DRAA |         EGE | 2013-01-01T17:00:00-05:00 | 2013-01-01T19:50:00-07:00 | 280 minutes |  1747 mi |      -5 minutes |     3 minutes |\n|      UA |   1597 |    EWR |      N24702 |         EGE | 2013-01-02T09:28:00-05:00 | 2013-01-02T12:20:00-07:00 | 261 minutes |  1726 mi |        1 minute |     3 minutes |\n|      AA |    575 |    JFK |      N631AA |         EGE | 2013-01-02T17:00:00-05:00 | 2013-01-02T19:50:00-07:00 | 260 minutes |  1747 mi |       5 minutes |    16 minutes |","category":"page"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"Looks (to me) like two different sources are reporting different info about the same flight.","category":"page"},{"location":"#Interface-1","page":"Tutorial","title":"Interface","text":"","category":"section"},{"location":"#Macros-1","page":"Tutorial","title":"Macros","text":"","category":"section"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"@_\n@>","category":"page"},{"location":"#LightQuery.@_","page":"Tutorial","title":"LightQuery.@_","text":"macro _(body)\n\nTerser function syntax. The arguments are inside the body; the first argument is _, the second argument is __, etc.\n\njulia> using LightQuery\n\njulia> (@_ _ + 1)(1)\n2\n\njulia> map((@_ __ - _), (1, 2), (2, 1))\n(1, -1)\n\n\n\n\n\n","category":"macro"},{"location":"#LightQuery.@>","page":"Tutorial","title":"LightQuery.@>","text":"macro >(body)\n\nIf body is in the form body_ |> tail_, call @_ on tail, and recur on body.\n\njulia> using LightQuery\n\njulia> @> 0 |> _ - 1 |> abs\n1\n\n\n\n\n\n","category":"macro"},{"location":"#Columns-1","page":"Tutorial","title":"Columns","text":"","category":"section"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"named_tuple\nName\nNames\nrename\ntransform\nremove\ngather\nspread","category":"page"},{"location":"#LightQuery.named_tuple","page":"Tutorial","title":"LightQuery.named_tuple","text":"named_tuple(it)\n\nCoerce to a named_tuple. For performance with working with arbitrary structs, define and @inline propertynames.\n\njulia> using LightQuery\n\njulia> @inline Base.propertynames(p::Pair) = (:first, :second);\n\njulia> named_tuple(:a => 1)\n(first = :a, second = 1)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.Name","page":"Tutorial","title":"LightQuery.Name","text":"Name(it)\n\nA typed name. For multiple names, use Names.\n\njulia> using LightQuery\n\njulia> Name(:a)((a = 1, b = 2))\n1\n\n\n\n\n\n","category":"type"},{"location":"#LightQuery.Names","page":"Tutorial","title":"LightQuery.Names","text":"Names(them...)\n\nTyped Names. For just one name, use Name.\n\njulia> using LightQuery\n\njulia> Names(:a, :b)((1, 2))\n(a = 1, b = 2)\n\njulia> Names(:a, :b)((a = 1, b = 2, c = 3))\n(a = 1, b = 2)\n\n\n\n\n\n","category":"type"},{"location":"#LightQuery.rename","page":"Tutorial","title":"LightQuery.rename","text":"rename(it; them...)\n\nRename it.\n\njulia> using LightQuery\n\njulia> rename((a = 1, b = 2), c = Name(:a))\n(b = 2, c = 1)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.transform","page":"Tutorial","title":"LightQuery.transform","text":"transform(it; them...)\n\nMerge them into it. Inverse of remove.\n\njulia> using LightQuery\n\njulia> transform((a = 1, b = 2), a = 3)\n(b = 2, a = 3)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.remove","page":"Tutorial","title":"LightQuery.remove","text":"remove(it, them...)\n\nRemove them. Inverse of transform.\n\njulia> using LightQuery\n\njulia> remove((a = 1, b = 2), Name(:b))\n(a = 1,)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.gather","page":"Tutorial","title":"LightQuery.gather","text":"gather(it; them...)\n\nFor each key => value pair in them, gather the Names in value into a single key. Inverse of spread.\n\njulia> using LightQuery\n\njulia> gather((a = 1, b = 2, c = 3), d = Names(:a, :c))\n(b = 2, d = (a = 1, c = 3))\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.spread","page":"Tutorial","title":"LightQuery.spread","text":"spread(it, them...)\n\nUnnest nested name in them. Inverse of gather.\n\njulia> using LightQuery\n\njulia> spread((b = 2, d = (a = 1, c = 3)), Name(:d))\n(b = 2, a = 1, c = 3)\n\n\n\n\n\n","category":"function"},{"location":"#Rows-1","page":"Tutorial","title":"Rows","text":"","category":"section"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"unzip\nEnumerated\nover\nindexed\nwhen\norder\nBy\nGroup\nkey\nvalue\nJoin\nLength","category":"page"},{"location":"#LightQuery.unzip","page":"Tutorial","title":"LightQuery.unzip","text":"unzip(it, n)\n\nUnzip an iterator it which returns tuples of length n. Use Val(n) to guarantee type stability.\n\njulia> using LightQuery\n\njulia> unzip([(1, 1.0), (2, 2.0)], 2)\n([1, 2], [1.0, 2.0])\n\njulia> unzip([(1, 1.0), (2, 2.0)], Val(2))\n([1, 2], [1.0, 2.0])\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.Enumerated","page":"Tutorial","title":"LightQuery.Enumerated","text":"Enumerated{It}\n\nRelies on the fact that iteration states can be converted to indices; thus, you might have to define LightQuery.state_to_index for unrecognized types. Ignores some iterators like Filter.\n\njulia> using LightQuery\n\njulia> collect(Enumerated(when([4, 3, 2, 1], iseven)))\n2-element Array{Tuple{Int64,Int64},1}:\n (1, 4)\n (3, 2)\n\n\n\n\n\n","category":"type"},{"location":"#LightQuery.over","page":"Tutorial","title":"LightQuery.over","text":"over(it, call)\n\nLazy map with argument order reversed.\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.indexed","page":"Tutorial","title":"LightQuery.indexed","text":"indexed(it, call)\n\nIndex it by the results of call, with a default to missing. Relies on Enumerated.\n\njulia> using LightQuery\n\njulia> result = indexed(\n            [\n                (item = \"b\", index = 2),\n                (item = \"a\", index = 1)\n            ],\n            Name(:index)\n        );\n\njulia> result[1]\n(item = \"a\", index = 1)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.when","page":"Tutorial","title":"LightQuery.when","text":"when(it, call)\n\nLazy filter with argument order reversed.\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.order","page":"Tutorial","title":"LightQuery.order","text":"order(it, call; keywords...)\n\nGeneralized sort. keywords will be passed to sort!; see the documentation there for options. See By for a way to explicitly mark that an object has been sorted. Relies on Enumerated.\n\njulia> using LightQuery\n\njulia> order([\n            (item = \"b\", index = 2),\n            (item = \"a\", index = 1)\n        ], Names(:index))\n2-element view(::Array{NamedTuple{(:item, :index),Tuple{String,Int64}},1}, [2, 1]) with eltype NamedTuple{(:item, :index),Tuple{String,Int64}}:\n (item = \"a\", index = 1)\n (item = \"b\", index = 2)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.By","page":"Tutorial","title":"LightQuery.By","text":"By(it, call)\n\nMark that it has been pre-sorted by call. For use with Group or Join.\n\njulia> using LightQuery\n\njulia> By([\n            (item = \"a\", index = 1),\n            (item = \"b\", index = 2)\n        ], Names(:index));\n\n\n\n\n\n","category":"type"},{"location":"#LightQuery.Group","page":"Tutorial","title":"LightQuery.Group","text":"Group(it::By)\n\nGroup consecutive keys in it. Requires a presorted object (see By). Relies on Enumerated.\n\njulia> using LightQuery\n\njulia> Group(By(\n            [\n                (item = \"a\", group = 1),\n                (item = \"b\", group = 1),\n                (item = \"c\", group = 2),\n                (item = \"d\", group = 2)\n            ],\n            Names(:group)\n        )) |>\n        collect\n2-element Array{Pair{NamedTuple{(:group,),Tuple{Int64}},SubArray{NamedTuple{(:item, :group),Tuple{String,Int64}},1,Array{NamedTuple{(:item, :group),Tuple{String,Int64}},1},Tuple{UnitRange{Int64}},true}},1}:\n (group = 1,) => [(item = \"a\", group = 1), (item = \"b\", group = 1)]\n (group = 2,) => [(item = \"c\", group = 2), (item = \"d\", group = 2)]\n\n\n\n\n\n","category":"type"},{"location":"#LightQuery.key","page":"Tutorial","title":"LightQuery.key","text":"key(it)\n\nThe key in a key => value pair.\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.value","page":"Tutorial","title":"LightQuery.value","text":"value(it)\n\nThe value in a key => value pair.\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.Join","page":"Tutorial","title":"LightQuery.Join","text":"Join(left::By, right::By)\n\nFind all pairs where isequal(left.call(left.it), right.call(right.it)).\n\njulia> using LightQuery\n\njulia> Join(\n            By(\n                [\n                    (left = \"a\", index = 1),\n                    (left = \"b\", index = 2),\n                    (left = \"e\", index = 5),\n                    (left = \"f\", index = 6)\n                ],\n                Names(:index)\n            ),\n            By(\n                [\n                    (right = \"a\", index = 1),\n                    (right = \"c\", index = 3),\n                    (right = \"d\", index = 4),\n                    (right = \"e\", index = 6)\n                ],\n                Names(:index)\n            )\n        ) |>\n        collect\n6-element Array{Pair{Union{Missing, NamedTuple{(:left, :index),Tuple{String,Int64}}},Union{Missing, NamedTuple{(:right, :index),Tuple{String,Int64}}}},1}:\n (left = \"a\", index = 1) => (right = \"a\", index = 1)\n (left = \"b\", index = 2) => missing\n                 missing => (right = \"c\", index = 3)\n                 missing => (right = \"d\", index = 4)\n (left = \"e\", index = 5) => missing\n (left = \"f\", index = 6) => (right = \"e\", index = 6)\n\nAssumes left and right are both strictly sorted (no repeats). If there are repeats, Group first. For other join flavors, combine with when. Make sure to annotate with Length if you know it.\n\n\n\n\n\n","category":"type"},{"location":"#LightQuery.Length","page":"Tutorial","title":"LightQuery.Length","text":"Length(it, length)\n\nAllow optimizations based on length. Especially useful after Join and before make_columns.\n\njulia> using LightQuery\n\njulia> @> Filter(iseven, 1:4) |>\n        Length(_, 2) |>\n        collect\n2-element Array{Int64,1}:\n 2\n 4\n\n\n\n\n\n","category":"type"},{"location":"#Pivot-1","page":"Tutorial","title":"Pivot","text":"","category":"section"},{"location":"#","page":"Tutorial","title":"Tutorial","text":"item_names\nrows\nPeek\ncolumns\nmake_columns","category":"page"},{"location":"#LightQuery.item_names","page":"Tutorial","title":"LightQuery.item_names","text":"item_names(it)\n\nFind names of items in it. Used in Peek and make_columns.\n\njulia> using LightQuery\n\njulia> item_names([(a = 1, b = 1.0), (a = 2, b = 2.0)])\n(a, b)\n\nIf inference cannot detect names, it will use propertynames of the first item.\n\njulia> item_names([(a = 1,), (a = 2, b = 2.0)])\n(a,)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.rows","page":"Tutorial","title":"LightQuery.rows","text":"rows(it)\n\nIterator over rows of a NamedTuple of arrays. Always lazy. Inverse of columns. See Peek for a way to view.\n\njulia> using LightQuery\n\njulia> collect(rows((a = [1, 2], b = [1.0, 2.0])))\n2-element Array{NamedTuple{(:a, :b),Tuple{Int64,Float64}},1}:\n (a = 1, b = 1.0)\n (a = 2, b = 2.0)\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.Peek","page":"Tutorial","title":"LightQuery.Peek","text":"Peek(it; max_rows = 4)\n\nGet a peek of an iterator which returns items with propertynames. Will show no more than max_rows. Relies on item_names.\n\njulia> using LightQuery\n\njulia> Peek(rows((a = 1:5, b = 5:-1:1)))\nShowing 4 of 5 rows\n|   a |   b |\n| ---:| ---:|\n|   1 |   5 |\n|   2 |   4 |\n|   3 |   3 |\n|   4 |   2 |\n\n\n\n\n\n","category":"type"},{"location":"#LightQuery.columns","page":"Tutorial","title":"LightQuery.columns","text":"columns(it)\n\nInverse of rows. Always lazy, see make_columns for eager version.\n\njulia> using LightQuery\n\njulia> columns(rows((a = [1], b = [1.0])))\n(a = [1], b = [1.0])\n\n\n\n\n\n","category":"function"},{"location":"#LightQuery.make_columns","page":"Tutorial","title":"LightQuery.make_columns","text":"make_columns(it)\n\nCollect into columns. Always eager, see columns for lazy version. Relies on item_names.\n\njulia> using LightQuery\n\njulia> make_columns([(a = 1, b = 1.0), (a = 2, b = 2.0)])\n(a = [1, 2], b = [1.0, 2.0])\n\n\n\n\n\n","category":"function"}]
}
