package com.trailsexplorer.mobile

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.trailsexplorer.mobile.databinding.ActivityMainBinding
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        fetchTrails()
    }

    private fun setupRecyclerView() {
        binding.rvTrails.layoutManager = LinearLayoutManager(this)
    }

    private fun fetchTrails() {
        // Mock data fallback for now, real implementation would add a getAllTrails to AuthService
        // Keeping it simple for the first native prototype
        
        /* 
        CoroutineScope(Dispatchers.IO).launch {
             // To implement: Add getTrails to API
        }
        */
        
        // Mocking successful data for immediate visual verification on user's end
        val mockTrails = listOf(
            Trail(1, "Yosemite Valley Loop", "Easy", "California"),
            Trail(2, "Half Dome Cable Route", "Hard", "California"),
            Trail(3, "Angels Landing", "Hard", "Utah"),
            Trail(4, "Emerald Lake", "Moderate", "Colorado"),
             Trail(5, "Bright Angel Trail", "Hard", "Arizona")
        )
        
        binding.rvTrails.adapter = TrailAdapter(mockTrails)
    }
}
