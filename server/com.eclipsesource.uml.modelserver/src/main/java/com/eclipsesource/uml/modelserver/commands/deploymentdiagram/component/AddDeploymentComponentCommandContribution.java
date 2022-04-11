package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.component;

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

public class AddDeploymentComponentCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addComponentContribution";
   public static final String PARENT_URI = "parentUri";

   public static CCompoundCommand create(final GPoint position, final String parentUri) {
      CCompoundCommand addComponentCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addComponentCommand.setType(TYPE);
      addComponentCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
            String.valueOf(position.getX()));
      addComponentCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
            String.valueOf(position.getY()));
      addComponentCommand.getProperties().put(PARENT_URI, parentUri);
      return addComponentCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
      GPoint position = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentUri = command.getProperties().get(PARENT_URI);

      return new AddComponentCompoundCommand(domain, modelUri, position, parentUri);
   }
}
