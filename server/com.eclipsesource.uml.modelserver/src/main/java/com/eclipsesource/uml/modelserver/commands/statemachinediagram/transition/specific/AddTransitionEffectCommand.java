package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Transition;
import org.eclipse.uml2.uml.UMLFactory;

public class AddTransitionEffectCommand extends UmlSemanticElementCommand {

    protected String semanticUriFragment;
    protected String newValue;
    protected final EClass eClass;

    public AddTransitionEffectCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                      final String newValue) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
        this.newValue = newValue;
        this.eClass = UMLFactory.eINSTANCE.createActivity().eClass();
    }

    @Override
    protected void doExecute() {
        Transition transition = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Transition.class);
        if (transition.getEffect() != null && !newValue.isEmpty()) {
            transition.getEffect().setName(newValue);
        } else if (transition.getEffect() != null && newValue.isEmpty()) {
            transition.getEffect().destroy();
        } else if (!newValue.isEmpty()) {
            transition.createEffect(newValue, eClass);
            transition.getEffect().setName("new effect");
        }
    }
}
