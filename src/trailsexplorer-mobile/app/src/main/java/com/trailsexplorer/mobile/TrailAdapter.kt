package com.trailsexplorer.mobile

import android.content.res.ColorStateList
import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.trailsexplorer.mobile.databinding.ItemTrailBinding
import com.google.gson.annotations.SerializedName

data class Trail(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("difficulty") val difficulty: String,
    @SerializedName("location") val location: String
)

class TrailAdapter(private val trails: List<Trail>) : RecyclerView.Adapter<TrailAdapter.TrailViewHolder>() {

    class TrailViewHolder(val binding: ItemTrailBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TrailViewHolder {
        val binding = ItemTrailBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TrailViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TrailViewHolder, position: Int) {
        val trail = trails[position]
        with(holder.binding) {
            tvTrailName.text = trail.name
            tvDifficulty.text = trail.difficulty
            tvLocation.text = trail.location

            // Dynamic color for difficulty
            val colorRes = when (trail.difficulty.lowercase()) {
                "easy" -> R.color.sage_green
                "moderate" -> R.color.earth_brown
                "hard" -> android.R.color.holo_red_dark
                else -> R.color.sage_green
            }
            tvDifficulty.backgroundTintList = ColorStateList.valueOf(ContextCompat.getColor(root.context, colorRes))
        }
    }

    override fun getItemCount() = trails.size
}
