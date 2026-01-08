package com.trailsexplorer.mobile

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    // Emulator uses 10.0.2.2 to access host localhost
    // Physical device uses LAN IP (e.g. 192.168.1.5)
    private const val BASE_URL = "http://10.0.2.2:5000/api/" 

    val instance: AuthService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        retrofit.create(AuthService::class.java)
    }
}
