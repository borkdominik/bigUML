package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.apache.log4j.Logger;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;

import static com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT;

public class AddActorCommandContribution extends UmlCompoundCommandContribution {

    private static Logger LOGGER = Logger.getLogger(AddActorCommandContribution.class);

    public static final String TYPE = "addActorContribution";

    public static CCompoundCommand create(final GPoint position) {
        CCompoundCommand addActorCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addActorCommand.setType(TYPE);
        addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
        addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
        return addActorCommand;
    }

    public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
        CCompoundCommand addActorCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addActorCommand.setType(TYPE);
        addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
        addActorCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
        addActorCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        return addActorCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        GPoint actorPosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
        if (command.getProperties().containsKey(PARENT_SEMANTIC_URI_FRAGMENT)) {
            String parentUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
            return new AddActorCompoundCommand(domain, modelUri, actorPosition, parentUri);
        }
        return new AddActorCompoundCommand(domain, modelUri, actorPosition);
    }
}
