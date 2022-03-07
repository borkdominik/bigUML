package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;

public class AddFinalStateCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "addFinalStateContributuion";
    public static final String PARENT_SEMANTIC_URI_FRAGMENT = "parentSemanticUriFragment";

    public static CCompoundCommand create(final String parentSemanticUri, final GPoint position) {
        CCompoundCommand addFinalStateCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addFinalStateCommand.setType(TYPE);
        addFinalStateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
                String.valueOf(position.getX()));
        addFinalStateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
                String.valueOf(position.getY()));
        addFinalStateCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);

        return addFinalStateCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        GPoint finalStatePosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
        String parentRegionUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);

        return new AddFinalStateCompoundCommand(domain, modelUri, finalStatePosition, parentRegionUriFragment);
    }
}
