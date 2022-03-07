package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Transition;

public class AddTransitionTriggerCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String newValue;

    public AddTransitionTriggerCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                       final String newValue) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newValue = newValue;
    }

    @Override
    protected void doExecute() {
        Transition transition = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Transition.class);
        // TODO: ALLOW MULTIPLE TRIGGERS
        if (transition.getTriggers().size() != 0 && !newValue.isEmpty()) {
            transition.getTriggers().get(0).setName(newValue);
        } else if (transition.getTriggers().size() != 0 && newValue.isEmpty()) {
            transition.getTriggers().remove(0);
        } else if (!newValue.isEmpty()) {
            transition.createTrigger(newValue).setName(newValue);
        }
    }
}
