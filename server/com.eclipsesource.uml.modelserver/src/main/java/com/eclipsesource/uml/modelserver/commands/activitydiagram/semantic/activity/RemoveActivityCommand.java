package com.eclipsesource.uml.modelserver.commands.activitydiagram.semantic.activity;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;

import com.eclipsesource.uml.modelserver.commands.commons.util.UmlSemanticCommandUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emf.common.util.URI;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.CallBehaviorAction;
import org.eclipse.uml2.uml.Element;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class RemoveActivityCommand extends UmlSemanticElementCommand {

    private final Activity activity;

    public RemoveActivityCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        activity = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Activity.class);
    }

    public Set<Element> getOwnedElements() {
        Set<Element> children = activity.getOwnedElements().stream().collect(Collectors.toSet());
        children.addAll(activity.getPartitions().stream()
                .filter(ActivityPartition.class::isInstance)
                .map(ActivityPartition.class::cast)
                .flatMap(partition -> getOwnedElements(partition).stream())
                .collect(Collectors.toSet()));
        return children;
    }

    public Set<Element> getReferencingCallBehaviorActions() {
        return activity.getModel().getPackagedElements().stream()
                .filter(Activity.class::isInstance)
                .map(Activity.class::cast)
                .flatMap(a -> a.getOwnedNodes().stream())
                .filter(CallBehaviorAction.class::isInstance)
                .map(CallBehaviorAction.class::cast)
                .filter(cba -> activity.equals(cba.getBehavior()))
                .collect(Collectors.toSet());
    }

    private List<Element> getOwnedElements(final ActivityPartition partition) {
        List<Element> elems = new ArrayList<>();
        for (ActivityPartition sub : partition.getSubpartitions()) {
            elems.add(sub);
            elems.addAll(getOwnedElements(sub));
        }
        return elems;
    }

    @Override
    protected void doExecute() {
        activity.getOwner().getOwnedComments().stream()
                .filter(c -> c.getAnnotatedElements().contains(activity))
                .collect(Collectors.toList())
                .forEach(c -> c.getAnnotatedElements().remove(activity));
        activity.getModel().getPackagedElements().remove(activity);
    }

}
