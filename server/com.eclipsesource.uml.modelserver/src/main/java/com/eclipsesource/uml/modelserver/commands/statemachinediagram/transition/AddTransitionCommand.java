package com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

public class AddTransitionCommand extends UmlSemanticElementCommand {

    private final Transition transition;
    protected final Vertex source;
    protected final Vertex target;
    protected final Region containerRegion;

    public AddTransitionCommand(final EditingDomain domain, final URI modelUri,
                                final String containerRegionUriFragment, final String sourceClassUriFragment,
                                final String targetClassUriFragment) {
        super(domain, modelUri);
        transition = UMLFactory.eINSTANCE.createTransition();
        source = UmlSemanticCommandUtil.getElement(umlModel, sourceClassUriFragment, Vertex.class);
        target = UmlSemanticCommandUtil.getElement(umlModel, targetClassUriFragment, Vertex.class);
        containerRegion = UmlSemanticCommandUtil.getElement(umlModel, containerRegionUriFragment, Region.class);
    }

    @Override
    protected void doExecute() {
        transition.setSource(source);
        transition.setTarget(target);
        transition.setKind(TransitionKind.EXTERNAL_LITERAL);
        containerRegion.getTransitions().add(transition);
    }

    public Transition getNewTransition() {
        return transition;
    }
}
