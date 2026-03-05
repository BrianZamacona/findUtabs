package com.findutabs.service;

import com.findutabs.dto.request.CreateTabRequest;
import com.findutabs.dto.request.TabRatingRequest;
import com.findutabs.dto.request.UpdateTabRequest;
import com.findutabs.dto.response.TabRatingResponse;
import com.findutabs.dto.response.TabResponse;
import com.findutabs.dto.response.TabVersionResponse;
import com.findutabs.exception.ResourceNotFoundException;
import com.findutabs.exception.UnauthorizedException;
import com.findutabs.model.Tab;
import com.findutabs.model.TabRating;
import com.findutabs.model.TabVersion;
import com.findutabs.model.User;
import com.findutabs.model.UserFavorite;
import com.findutabs.repository.TabRatingRepository;
import com.findutabs.repository.TabRepository;
import com.findutabs.repository.TabVersionRepository;
import com.findutabs.repository.UserFavoriteRepository;
import com.findutabs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TabService {

    private final TabRepository tabRepository;
    private final UserRepository userRepository;
    private final TabVersionRepository tabVersionRepository;
    private final TabRatingRepository tabRatingRepository;
    private final UserFavoriteRepository userFavoriteRepository;

    @Transactional
    public TabResponse createTab(CreateTabRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Tab tab = new Tab();
        tab.setTitle(request.getTitle());
        tab.setArtist(request.getArtist());
        tab.setDifficulty(request.getDifficulty());
        tab.setTuning(request.getTuning() != null ? request.getTuning() : "Standard");
        tab.setUser(user);
        tab.setFileUrl(request.getFileUrl());
        tab.setAlphaTexData(request.getAlphaTexData());
        tab.setViews(0);

        tab = tabRepository.save(tab);
        return mapToTabResponse(tab);
    }

    @Transactional
    public TabResponse updateTab(Long tabId, UpdateTabRequest request, String username) {
        Tab tab = tabRepository.findById(tabId)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found with id: " + tabId));

        if (!tab.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You don't have permission to update this tab");
        }

        // Save current version before updating
        TabVersion version = TabVersion.builder()
                .tab(tab)
                .versionNumber(tabVersionRepository.findTopByTabIdOrderByVersionNumberDesc(tabId)
                        .map(v -> v.getVersionNumber() + 1)
                        .orElse(1))
                .alphaTexData(tab.getAlphaTexData())
                .changeNotes(request.getChangeNotes())
                .createdBy(tab.getUser())
                .createdAt(LocalDateTime.now())
                .build();
        tabVersionRepository.save(version);

        tab.setTitle(request.getTitle());
        tab.setArtist(request.getArtist());
        tab.setDifficulty(request.getDifficulty());
        if (request.getTuning() != null) {
            tab.setTuning(request.getTuning());
        }
        tab.setAlphaTexData(request.getAlphaTexData());

        tab = tabRepository.save(tab);
        return mapToTabResponse(tab);
    }

    public TabResponse getTabById(Long id) {
        Tab tab = tabRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found with id: " + id));
        return mapToTabResponse(tab);
    }

    @Transactional
    public TabResponse incrementViews(Long id) {
        Tab tab = tabRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found with id: " + id));
        tab.setViews(tab.getViews() + 1);
        tab = tabRepository.save(tab);
        return mapToTabResponse(tab);
    }

    public Page<TabResponse> getAllTabs(Pageable pageable) {
        return tabRepository.findAll(pageable).map(this::mapToTabResponse);
    }

    public Page<TabResponse> searchTabsByArtist(String artist, Pageable pageable) {
        return tabRepository.findByArtistContainingIgnoreCase(artist, pageable)
                .map(this::mapToTabResponse);
    }

    public Page<TabResponse> searchTabsByTitle(String title, Pageable pageable) {
        return tabRepository.findByTitleContainingIgnoreCase(title, pageable)
                .map(this::mapToTabResponse);
    }

    public Page<TabResponse> getTabsByUserId(Long userId, Pageable pageable) {
        return tabRepository.findByUserId(userId, pageable).map(this::mapToTabResponse);
    }

    public List<TabResponse> getTopTabs() {
        return tabRepository.findTop10ByOrderByViewsDesc()
                .stream()
                .map(this::mapToTabResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTab(Long id, String username) {
        Tab tab = tabRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found with id: " + id));

        if (!tab.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You don't have permission to delete this tab");
        }

        tabRepository.delete(tab);
    }

    @Transactional(readOnly = true)
    public List<TabVersionResponse> getTabVersions(Long tabId) {
        if (!tabRepository.existsById(tabId)) {
            throw new ResourceNotFoundException("Tab not found with id: " + tabId);
        }
        return tabVersionRepository.findByTabIdOrderByVersionNumberDesc(tabId)
                .stream()
                .map(this::mapToTabVersionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TabRatingResponse rateTab(Long tabId, TabRatingRequest request, String username) {
        Tab tab = tabRepository.findById(tabId)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found with id: " + tabId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<TabRating> existing = tabRatingRepository.findByTabIdAndUserId(tabId, user.getId());
        TabRating rating;
        if (existing.isPresent()) {
            rating = existing.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
        } else {
            rating = TabRating.builder()
                    .tab(tab)
                    .user(user)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();
        }
        rating = tabRatingRepository.save(rating);
        return mapToTabRatingResponse(rating);
    }

    @Transactional(readOnly = true)
    public List<TabRatingResponse> getTabRatings(Long tabId) {
        if (!tabRepository.existsById(tabId)) {
            throw new ResourceNotFoundException("Tab not found with id: " + tabId);
        }
        return tabRatingRepository.findByTabIdOrderByCreatedAtDesc(tabId)
                .stream()
                .map(this::mapToTabRatingResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleFavorite(Long tabId, String username) {
        Tab tab = tabRepository.findById(tabId)
                .orElseThrow(() -> new ResourceNotFoundException("Tab not found with id: " + tabId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<UserFavorite> existing = userFavoriteRepository.findByUserIdAndTabId(user.getId(), tabId);
        if (existing.isPresent()) {
            userFavoriteRepository.delete(existing.get());
            return false;
        } else {
            UserFavorite favorite = UserFavorite.builder()
                    .user(user)
                    .tab(tab)
                    .build();
            userFavoriteRepository.save(favorite);
            return true;
        }
    }

    public Page<TabResponse> getUserFavorites(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userFavoriteRepository.findByUserId(user.getId(), pageable)
                .map(fav -> mapToTabResponse(fav.getTab()));
    }

    private TabResponse mapToTabResponse(Tab tab) {
        Double avgRating = tabRatingRepository.findAverageRatingByTabId(tab.getId());
        long ratingCount = tabRatingRepository.countByTabId(tab.getId());
        return new TabResponse(
                tab.getId(),
                tab.getTitle(),
                tab.getArtist(),
                tab.getDifficulty(),
                tab.getTuning(),
                tab.getUser().getId(),
                tab.getUser().getUsername(),
                tab.getFileUrl(),
                tab.getAlphaTexData(),
                tab.getViews(),
                avgRating,
                ratingCount,
                tab.getCreatedAt(),
                tab.getUpdatedAt()
        );
    }

    private TabVersionResponse mapToTabVersionResponse(TabVersion version) {
        return new TabVersionResponse(
                version.getId(),
                version.getTab().getId(),
                version.getVersionNumber(),
                version.getAlphaTexData(),
                version.getChangeNotes(),
                version.getCreatedBy().getId(),
                version.getCreatedBy().getUsername(),
                version.getCreatedAt()
        );
    }

    private TabRatingResponse mapToTabRatingResponse(TabRating rating) {
        return new TabRatingResponse(
                rating.getId(),
                rating.getTab().getId(),
                rating.getUser().getId(),
                rating.getUser().getUsername(),
                rating.getRating(),
                rating.getComment(),
                rating.getCreatedAt()
        );
    }
}

