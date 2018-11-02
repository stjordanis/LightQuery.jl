var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "#LightQuery.Nameless",
    "page": "Home",
    "title": "LightQuery.Nameless",
    "category": "type",
    "text": "A container for a function and the expression that generated it\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.based_on-Tuple{NamedTuple}",
    "page": "Home",
    "title": "LightQuery.based_on",
    "category": "method",
    "text": "based_on(data; kwargs...)\n\njulia> using LightQuery\n\njulia> based_on((a = 1, b = 2), c = @_ _.a + _.b)\n(c = 3,)\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.columns",
    "page": "Home",
    "title": "LightQuery.columns",
    "category": "function",
    "text": "columns(data)\n\njulia> using LightQuery\n\njulia> columns([(a = 1, b = 2), (a = 2, b = 1)])\n(a = [1, 2], b = [2, 1])\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.flatten_columns-Tuple{Any}",
    "page": "Home",
    "title": "LightQuery.flatten_columns",
    "category": "method",
    "text": "flatten_columns(iterator)\n\nFlatten the columns of an iterator of named tuples.\n\njulia> using LightQuery\n\njulia> flatten_columns([(a = [1, 2], b = [4, 3]), (a = [3, 4], b = [2, 1])])\n(a = [1, 2, 3, 4], b = [4, 3, 2, 1])\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.group_by-Tuple{NamedTuple,Symbol}",
    "page": "Home",
    "title": "LightQuery.group_by",
    "category": "method",
    "text": "group_by(data, s::Symbol)\n\njulia> using LightQuery\n\njulia> group_by((a = [1, 1, 2, 2], b = [1, 2, 3, 4]), :a)\n2-element Array{NamedTuple{(:a, :b),Tuple{Array{Int64,1},Array{Int64,1}}},1}:\n (a = [1, 1], b = [1, 2])\n (a = [2, 2], b = [3, 4])\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.inner_join-Tuple{Any,Any,Symbol}",
    "page": "Home",
    "title": "LightQuery.inner_join",
    "category": "method",
    "text": "inner_join(data1, data2)\n\njulia> using LightQuery\n\njulia> inner_join(\n            [(a = 1, b = 1), (a = 2, b = 2)],\n            [(a = 2, c = 2), (a = 3, c = 3)],\n            :a\n        )\n1-element Array{NamedTuple{(:a, :b, :c),Tuple{Int64,Int64,Int64}},1}:\n (a = 2, b = 2, c = 2)\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.order_by-Tuple{NamedTuple,Symbol}",
    "page": "Home",
    "title": "LightQuery.order_by",
    "category": "method",
    "text": "order_by(data, s::Symbol)\n\njulia> using LightQuery\n\njulia> order_by((a = [1, 2], b = [2, 1]), :b)\n(a = [2, 1], b = [1, 2])\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.pretty-Tuple{Any}",
    "page": "Home",
    "title": "LightQuery.pretty",
    "category": "method",
    "text": "pretty(data)\n\njulia> using LightQuery\n\njulia> pretty([(a = 1, b = 2), (a = 2, b = 1)]);\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.rows-Tuple{NamedTuple}",
    "page": "Home",
    "title": "LightQuery.rows",
    "category": "method",
    "text": "rows(data)\n\njulia> using LightQuery\n\njulia> rows((a = [1, 2], b = [2, 1]))\n2-element Array{NamedTuple{(:a, :b),Tuple{Int64,Int64}},1}:\n (a = 1, b = 2)\n (a = 2, b = 1)\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.select-Tuple{NamedTuple,Vararg{Any,N} where N}",
    "page": "Home",
    "title": "LightQuery.select",
    "category": "method",
    "text": "select(data, args...)\n\njulia> using LightQuery\n\njulia> select((a = 1, b = 2, c = 3), :a, :c)\n(a = 1, c = 3)\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.transform-Tuple{NamedTuple}",
    "page": "Home",
    "title": "LightQuery.transform",
    "category": "method",
    "text": "transform(data; kwargs...)\n\njulia> using LightQuery\n\njulia> transform((a = 1, b = 2), c = @_ _.a + _.b)\n(a = 1, b = 2, c = 3)\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.where-Tuple{NamedTuple,Any}",
    "page": "Home",
    "title": "LightQuery.where",
    "category": "method",
    "text": "where(data, f)\n\njulia> using LightQuery\n\njulia> where((a = [1, 2], b = [2, 1]), @_ _.b .> 1)\n(a = [1], b = [2])\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.@>-Tuple{Any}",
    "page": "Home",
    "title": "LightQuery.@>",
    "category": "macro",
    "text": "macro >(body)\n\nIf body is in the form body_ |> tail_, call @_ on tail, and recur on body.\n\njulia> using LightQuery\n\njulia> @> 0 |> _ + 1 |> _ - 1\n0\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.@_-Tuple{Expr}",
    "page": "Home",
    "title": "LightQuery.@_",
    "category": "macro",
    "text": "macro _(body::Expr)\n\nCreate an Nameless object. The arguments are inside the body; the first arguments is _, the second argument is __, etc. Also stores a quoted version of the function.\n\njulia> using LightQuery\n\njulia> 1 |> @_(_ + 1)\n2\n\njulia> map(@_(__ - _), (1, 2), (2, 1))\n(1, -1)\n\njulia> @_(_ + 1).expression\n:(_ + 1)\n\n\n\n\n\n"
},

{
    "location": "#LightQuery.jl-1",
    "page": "Home",
    "title": "LightQuery.jl",
    "category": "section",
    "text": "Modules = [LightQuery]"
},

]}
