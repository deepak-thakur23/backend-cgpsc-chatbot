

function authorized(request, response, next) {
    passport.authenticate('jwt', { session: false, }, async (error, token) => {
        if (error || !token) {
            response.status(401).json({ success: false, message: 'Unauthorized' });
        }
        try {
            const user = await User.findOne({
                where: { id: token.id },
            });
            request.user = user;
        } catch (error) {
            next(error);
        }
        next();
    })(request, response, next);
}

router.use('/user', authorized, userRouter);