/*        //FILTERING LOGIC
    let queryObj={...req.query};
        const excludeFields=["sort","fields","page","limit"];
        excludeFields.forEach(el=>{
            delete queryObj[el]
        });
        let queryStr=JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> {
            return `$${match}`;
        });    
        queryObj=JSON.parse(queryStr);

        let queryMovie = Movies.find(queryObj);  //find({duration: {$gte: 90},ratings: {$gte: 7.0},price: {$lte: 100}})

        //SORTING LOGIC
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ');
            queryMovie = queryMovie.sort(sortBy);
        }else{
            queryMovie = queryMovie.sort('-createdAt');
        }
        //LIMITING FIELDS
         if(req.query.fields){
            let fields = req.query.fields.split(',').join(' ');
            queryMovie=queryMovie.select(fields);
         }else{
            queryMovie=queryMovie.select('-__v');
         }
         //PAGINATION LOGIC
         const page=req.query.page || 1;
         const limit=req.query.page || 10;
         let skip=(page - 1)*limit;
         queryMovie=queryMovie.skip(skip).limit(limit);
         if(req.query.page){
            const moviesCount =await Movies.countDocuments();
            if(skip>=moviesCount){
                throw new Error('This page is not found!!');
            }
         }
        const movies=await queryMovie; */