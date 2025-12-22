package com.findutabs.service;

import com.findutabs.dto.request.CreateTabRequest;
import com.findutabs.dto.response.TabResponse;
import com.findutabs.exception.ResourceNotFoundException;
import com.findutabs.model.Tab;
import com.findutabs.model.User;
import com.findutabs.repository.TabRepository;
import com.findutabs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TabService {

    private final TabRepository tabRepository;
    private final UserRepository userRepository;

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
        tab.setViews(0);

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
            throw new RuntimeException("You don't have permission to delete this tab");
        }

        tabRepository.delete(tab);
    }

    private TabResponse mapToTabResponse(Tab tab) {
        return new TabResponse(
                tab.getId(),
                tab.getTitle(),
                tab.getArtist(),
                tab.getDifficulty(),
                tab.getTuning(),
                tab.getUser().getId(),
                tab.getUser().getUsername(),
                tab.getFileUrl(),
                tab.getViews(),
                tab.getCreatedAt(),
                tab.getUpdatedAt()
        );
    }
}
