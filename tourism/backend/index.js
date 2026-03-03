const connectDB = require('./db');
const authRoute = require('./routes/auth');
const bookingRoute = require('./routes/bookings');
const reviewRoute = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3030;

// Database connection
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/review', reviewRoute);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
